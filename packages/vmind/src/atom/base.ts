/**
 * Base Class of Atom Module
 */

import { merge } from '@visactor/vutils';
import type { BaseContext } from '../types/atom';
import { AtomName } from '../types/atom';
import type { LLMMessage, LLMResponse, ToolMessage } from '../types/llm';
import type { BaseOptions } from './type';

export class BaseAtom<Ctx extends BaseContext, O extends BaseOptions> {
  /** name */
  name: AtomName = AtomName.BASE;
  /** context before atom execute */
  protected originContext: Ctx;
  /** current context to self-update */
  protected context: Ctx;
  /** llm response and user's query */
  protected responses: LLMMessage[];
  /** base Options */
  options: O;
  /** is based on LLM */
  isLLMAtom: boolean;
  /** historys of context update */
  history: {
    /** map of history context */
    map: Map<number, Ctx>;
    /** id of history Step */
    idList: number[];
    /** current id */
    id: number;
  };

  constructor(context: Partial<Ctx>, options: Partial<O>) {
    this.options = merge({}, this.buildDefaultOptions(), options);
    this.responses = [];
    this.history = {
      map: new Map(),
      idList: [],
      id: null
    };
    this.setNewContext(this.buildDefaultContext(context as any));
    if (!this.options.llm && this.isLLMAtom) {
      console.error(`Does\'t support LLM Mange in ${this.name} Atom which need LLM`);
    }
  }

  protected setNewContext(context: Ctx) {
    this.context = context;
    const newHistoryId = (this.history.id || 0) + 1;
    this.history.map.set(newHistoryId, context);
    this.history.idList.push(newHistoryId);
    this.history.id = newHistoryId;
  }

  undo(id?: string) {
    /** todo */
  }

  redo(id?: string) {
    /** todo */
  }

  buildDefaultContext(context: Ctx) {
    return context ?? this.context;
  }

  buildDefaultOptions(): O {
    return {} as O;
  }

  updateContext(context: Partial<Ctx>) {
    if (context) {
      this.context = merge({}, this.context, context);
    }
    return this.context;
  }

  updateOptions(options: Partial<O>) {
    this.options = merge({}, this.options, options);
  }

  reset(context?: Partial<Ctx>) {
    this.context = this.buildDefaultContext(context as any);
    this.responses = [];
    this.history.map.clear();
    this.history.idList = [];
    this.history.id = null;
  }

  getContext() {
    return this.context;
  }

  getContextBeforeRun() {
    return this.originContext;
  }

  /** check should run or not when context in schdule changed */
  shouldRunByContextUpdate(context: Ctx) {
    return false;
  }

  /**
   * run atom function to update context
   * @param userInput
   * @param userInput.context new context to update
   * @param userInput.query user's query to adjust context
   * @param userInput.messages user's history messages
   * @returns new context after execute atom function
   */
  async run(userInput?: { context?: Ctx; query?: string; messages?: LLMMessage[] }) {
    const { context, query, messages } = userInput || {};
    if (!!messages) {
      this.setResponses(messages);
    }
    this.context.error = null;
    this.updateContext(context);
    this.originContext = this.context;
    try {
      this.runBeforeLLM();
      if (this.isLLMAtom && query) {
        await this.runWithChat(query);
        this._runWithOutLLM();
        return this.context;
      }
      if (this.isLLMAtom) {
        const messages = this.getLLMMessages();
        const functionCalls = this.getFunctionCalls();
        const data = await this.options.llm.run(this.name, messages, functionCalls);
        const resJson = this.options.llm.parseJson(data);
        const toolJson = this.options.llm.parseTools(data);
        if (resJson.error || data?.error) {
          return this.runWithLLMError(resJson.error ?? data?.error);
        }
        this.recordLLMResponse(data);
        this.setNewContext({
          ...this.parseLLMContent(resJson, toolJson, data),
          usage: (data as LLMResponse)?.usage
        });
        this._runWithOutLLM();
      } else {
        this._runWithOutLLM();
      }
    } catch (error) {
      return this.runWithLLMError(error as string);
    }
    return this.context;
  }

  protected runBeforeLLM() {
    return this.context;
  }

  protected runWithLLMError(error: string) {
    this.updateContext({ error: `LLM Error in ${this.name}.\n${error}` } as any);
    console.error(this.context.error);
    return this.context;
  }

  /**
   * after run function, user can adjust context result by multi-turn dialogue
   * @param query user's new query
   * @returns new context after execute
   */
  async runWithChat(query: string) {
    const messages = this.getLLMMessages(query);
    const functionCalls = this.getFunctionCalls();
    const data = await this.options.llm.run(this.name, messages, functionCalls);
    const resJson = this.options.llm.parseJson(data);
    const toolJson = this.options.llm.parseTools(data);
    if (!resJson.error && !resJson.error) {
      this.recordLLMResponse(data, query);
      this.setNewContext({ ...this.parseLLMContent(resJson, toolJson, data), usage: (data as LLMResponse)?.usage });
    } else {
      this.updateContext({ error: resJson?.error || toolJson?.error } as any);
    }
    return this.context;
  }

  protected _runWithOutLLM(): Ctx {
    return this.context;
  }

  protected getHistoryLLMMessages(query?: string): LLMMessage[] {
    return query
      ? [
          ...this.responses,
          {
            role: 'user' as const,
            content: query
          }
        ]
      : [];
  }

  protected getLLMMessages(query?: string): LLMMessage[] {
    return [];
  }

  protected getFunctionCalls(): ToolMessage[] {
    return this.options?.tools;
  }

  protected parseLLMContent(resJson: any, toolJson?: any, llmRes?: LLMResponse) {
    return { ...this.context };
  }

  /** record LLM response and user's query to multi-turn dialog */
  protected recordLLMResponse(data: LLMResponse, query?: string) {
    const newResponse = data.choices[0].message;
    const assistantMsg: LLMMessage = {
      role: 'assistant',
      content: newResponse
    };
    if (!query) {
      // record with out uesr's query, it's new to record
      this.responses = [assistantMsg];
    } else {
      // record a round of conversation
      this.responses.push(
        {
          role: 'user',
          content: newResponse
        },
        assistantMsg
      );
    }
  }

  setResponses(messages: LLMMessage[]) {
    this.responses = messages;
  }

  getResponses() {
    return this.responses;
  }

  clearHistory() {
    this.responses.length = 0;
  }
}
