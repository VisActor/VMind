import { Prompt } from 'src/base/tools/prompt';
import { BaseTaskNode } from './baseTaskNode';
import { Parser } from 'src/base/tools/parser';
import { Patcher } from 'src/base/tools/patcher';
import { ChatManager } from 'src/base/tools/chatManager';
import { ILLMOptions, RequestFunc } from './types';

/**
 * LLMBasedTaskNode is a task node that needs to use LLM to complete tasks
 * Subclasses must assign values to prompt, parser, patcher, and requester
 */
export class LLMBasedTaskNode<Context extends { llmOptions: ILLMOptions }, DSL> extends BaseTaskNode<Context, DSL> {
  prompt: Prompt<Context>;
  parser: Parser<DSL>;
  patcher: Patcher<DSL, Context>;
  requester: RequestFunc;
  chatManager: ChatManager;

  constructor() {
    super();
    this.chatManager = new ChatManager();
  }

  async requestLLM(context: Context) {
    const { llmOptions } = context;
    const llmResponse = await this.requester(
      this.prompt.getPrompt(context),
      this.chatManager.getLatestUserMessage().content,
      llmOptions
    );
    return llmResponse;
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
