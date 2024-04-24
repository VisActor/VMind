import type { Prompt } from '../../base/tools/prompt';
import { BaseTaskNode } from './baseTaskNode';
import type { Parser } from '../../base/tools/parser';
import type { Patcher } from '../../base/tools/patcher';
import { ChatManager } from '../../base/tools/chatManager';
import type { ILLMOptions, ModelType, TaskError } from '../../common/typings';
import { TaskNodeType } from './types';
import type { Requester } from '../tools/requester';
import { getObjectProperties } from '../../common/utils/utils';

export interface ILLMTaskNode<Context, DSL> {
  modelType: ModelType;
  prompt: Prompt<Context>;
  chatManager: ChatManager;
  parser: Parser<any, Partial<DSL>>;
  patcher: Patcher<Context, Partial<DSL>>;

  requester: Requester<Context>;
}

export type LLMTaskNodeOptions<Context, DSL> = {
  parser: Parser<any, Partial<DSL>>;
  patcher: Patcher<Context, Partial<DSL>>;
  prompt: Prompt<Context>;
  requester: Requester<Context>;
  modelType: ModelType;
};

/**
 * LLMBasedTaskNode is a task node that needs to use LLM to complete tasks
 * It first requests LLM using requester function to get a response
 * It then uses a parser to parse the response content from LLM into a specific format
 * Finally, it patches the response from LLM according to the rules to get the final result (DSL). The patcher consists of a series of pipelines, and these pipelines are executed in sequence to complete the patch
 */
export default class LLMBasedTaskNode<Context extends { llmOptions: ILLMOptions }, DSL>
  extends BaseTaskNode<Context, DSL>
  implements ILLMTaskNode<Context, DSL>
{
  prompt: Prompt<Context>;
  chatManager: ChatManager;
  parser: Parser<any, Partial<DSL>>;
  patcher: Patcher<Context, Partial<DSL>>;
  requester: Requester<Context>;
  modelType: ModelType;

  constructor(name: string, options: LLMTaskNodeOptions<Context, DSL>) {
    super(name);
    this.type = TaskNodeType.LLM_BASED;
    this.chatManager = new ChatManager();
    const { parser, patcher, requester, prompt, modelType } = options;
    this.parser = parser;
    this.patcher = patcher;
    this.requester = requester;
    this.prompt = prompt;
    this.modelType = modelType;
  }

  async requestLLM(context: Context): Promise<TaskError | DSL> {
    try {
      const systemPrompt = this.prompt.getSystemPrompt(context);
      const userPrompt = this.prompt.getUserPrompt(context);
      return await this.requester(systemPrompt, userPrompt, context);
    } catch (e: any) {
      console.error(`${this.name} error!`);
      console.error(e);
      return {
        ...getObjectProperties(e),
        error: true
      };
    }
  }

  parseLLMResponse(llmResponse: any): Partial<DSL> | TaskError {
    try {
      return this.parser(llmResponse);
    } catch (e: any) {
      console.error(`${this.name} error!`);
      console.error(e);
      return {
        ...getObjectProperties(e),
        error: true
      };
    }
  }

  patchLLMResponse(input: Context & DSL): DSL | TaskError {
    try {
      if (this.patcher.length === 0) {
        return input;
      }
      const result = this.patcher.reduce((pre, pipeline) => {
        const res = pipeline(pre);
        return { ...pre, ...res } as Context & DSL;
      }, input);
      return result;
    } catch (e: any) {
      console.error(`${this.name} error!`);
      console.error(e);
      return {
        ...getObjectProperties(e),
        error: true
      };
    }
  }

  async executeTask(context: Context): Promise<TaskError | DSL> {
    this.updateContext({ ...this.context, ...context });
    const llmResponse = await this.requestLLM(context);
    const parsedResponse = this.parseLLMResponse(llmResponse) as DSL;
    const patchedResponse = this.patchLLMResponse({ ...context, ...parsedResponse });
    return patchedResponse;
  }
}
