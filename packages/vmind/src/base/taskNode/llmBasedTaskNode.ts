import { Prompt } from 'src/base/tools/prompt';
import { BaseTaskNode } from './baseTaskNode';
import { Parser } from 'src/base/tools/parser';
import { Patcher } from 'src/base/tools/patcher';
import { ChatManager } from 'src/base/tools/chatManager';
import { ILLMOptions, RequestFunc } from 'src/typings';

export interface ILLMTaskNode<Context, DSL> {
  prompt: Prompt<Context>;
  chatManager: ChatManager;
  parser: Parser<DSL>;
  patcher: Patcher<DSL, Context>;

  requestLLM: (context: Context) => Promise<any>;
  //parseLLMResponse: (response: any) => Partial<DSL>
  //patchLLMResponse: (input: Partial<DSL>, context: Context) => DSL
  //executeTask: (context: Context) => Promise<DSL>
}
/**
 * LLMBasedTaskNode is a task node that needs to use LLM to complete tasks
 * Subclasses must assign values to prompt, parser and patcher
 */
export class LLMBasedTaskNode<Context extends { llmOptions: ILLMOptions }, DSL>
  extends BaseTaskNode<Context, DSL>
  implements ILLMTaskNode<Context, DSL>
{
  prompt: Prompt<Context>;
  chatManager: ChatManager;
  parser: Parser<DSL>;
  patcher: Patcher<DSL, Context>;

  constructor() {
    super();
    this.chatManager = new ChatManager();
  }

  async requestLLM(context: Context): Promise<any> {
    return null;
  }

  parseLLMResponse(llmResponse: any): Partial<DSL> {
    return this.parser.parse(llmResponse);
  }

  patchLLMResponse(input: Partial<DSL>, context: Context): DSL {
    return this.patcher.patch(input, context);
  }

  async executeTask(context: Context) {
    const llmResponse = await this.requestLLM(context);
    const parsedResponse = this.parseLLMResponse(llmResponse);
    const patchedResponse = this.patchLLMResponse(parsedResponse, context);
    return patchedResponse;
  }
}
