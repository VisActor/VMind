import { Prompt } from 'src/baseTools/prompt';
import { BaseTaskNode } from './base';
import { Parser } from 'src/baseTools/parser';
import { Patcher } from 'src/baseTools/patcher';
import { ChatManager } from 'src/baseTools/chatManager';
import { ILLMOptions, RequestFunc } from './types';

export class LLMBasedTaskNode<Context extends { llmOptions: ILLMOptions }, DSL> extends BaseTaskNode<Context, DSL> {
  prompt: Prompt<Context>;
  parser: Parser<DSL>;
  patcher: Patcher<DSL, Context>;
  requester: RequestFunc;
  chatManager: ChatManager;

  constructor(context: Context) {
    super(context);
    this.chatManager = new ChatManager();
  }

  async requestLLM() {
    const { llmOptions } = this.context;
    const llmResponse = await this.requester(
      this.prompt.getPrompt(),
      this.chatManager.getLatestUserMessage().content,
      llmOptions
    );
    return llmResponse;
  }

  parseLLMResponse(llmResponse: any): Partial<DSL> {
    //void function
    //A parser must be initialized in the subclass.
    return this.parser.parse(llmResponse);
  }

  patchLLMResponse(input: Partial<DSL>): DSL {
    //void function
    //A patcher must be initialized in the subclass.
    return this.patcher.patch(input, this.context);
  }

  async executeTask() {
    const llmResponse = await this.requestLLM();
    const parsedResponse = this.parseLLMResponse(llmResponse);
    const patchedResponse = this.patchLLMResponse(parsedResponse);
    return patchedResponse;
  }
}
