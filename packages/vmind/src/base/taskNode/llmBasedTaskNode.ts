import { Prompt } from 'src/base/tools/prompt';
import { BaseTaskNode } from './baseTaskNode';
import { Parser } from 'src/base/tools/parser';
import { Patcher } from 'src/base/tools/patcher';
import { ChatManager } from 'src/base/tools/chatManager';
import { ILLMOptions, ModelType, RequestFunc } from 'src/typings';
import { TaskNodeType } from './types';
import { Requester } from '../tools/requester';

export interface ILLMTaskNode<Context, DSL> {
  modelType: ModelType;
  prompt: Prompt<Context>;
  chatManager: ChatManager;
  parser: Parser<any, DSL>;
  patcher: Patcher<Context, DSL>;

  requester: Requester<Context>;
}

export type LLMTaskNodeOptions<Context, DSL> = {
  parser: Parser<any, DSL>;
  patcher: Patcher<Context, DSL>;
  prompt: Prompt<Context>;
  requester: Requester<Context>;
  modelType: ModelType;
};
/**
 * LLMBasedTaskNode is a task node that needs to use LLM to complete tasks
 * Subclasses must assign values to prompt, parser and patcher, and rewrite requestLLM function
 */
export default class LLMBasedTaskNode<Context extends { llmOptions: ILLMOptions }, DSL>
  extends BaseTaskNode<Context, DSL>
  implements ILLMTaskNode<Context, DSL>
{
  prompt: Prompt<Context>;
  chatManager: ChatManager;
  parser: Parser<any, DSL>;
  patcher: Patcher<Context, DSL>;
  requester: Requester<Context>;
  modelType: ModelType;

  constructor(options: LLMTaskNodeOptions<Context, DSL>) {
    super();
    this.type = TaskNodeType.LLM_BASED;
    this.chatManager = new ChatManager();
    const { parser, patcher, requester, prompt, modelType } = options;
    this.parser = parser;
    this.patcher = patcher;
    this.requester = requester;
    this.prompt = prompt;
    this.modelType = modelType;
  }

  async requestLLM(context: Context): Promise<any> {
    const prompt = this.prompt.getPrompt(context);
    return await this.requester(prompt, context);
  }

  parseLLMResponse(llmResponse: any): Partial<DSL> {
    return this.parser(llmResponse);
  }

  patchLLMResponse(input: Partial<DSL>, context: Context): DSL {
    const result = this.patcher.reduce((pre, pipeline) => {
      const res = pipeline(pre, context);
      return res;
    }, input) as DSL;
    return result;
  }

  async executeTask(context: Context) {
    this.updateContext(context);
    const llmResponse = await this.requestLLM(context);
    const parsedResponse = this.parseLLMResponse(llmResponse);
    const patchedResponse = this.patchLLMResponse(parsedResponse, context);
    return patchedResponse;
  }
}
