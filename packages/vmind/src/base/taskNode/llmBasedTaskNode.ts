import { Prompt } from 'src/base/tools/prompt';
import { BaseTaskNode } from './baseTaskNode';
import { Parser } from 'src/base/tools/parser';
import { Patcher } from 'src/base/tools/patcher';
import { ChatManager } from 'src/base/tools/chatManager';
import { ILLMOptions, ModelType, TaskError } from 'src/common/typings';
import { TaskNodeType } from './types';
import { Requester } from '../tools/requester';
import { getObjectProperties } from 'src/common/utils/utils';

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
      const prompt = this.prompt.getPrompt(context);
      return await this.requester(prompt, context);
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
