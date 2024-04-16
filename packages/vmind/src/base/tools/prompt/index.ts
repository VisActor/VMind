import { IPrompt } from './types';
/**
 * Prompt represents a LLM Prompt
 * Pass in Template when initialization
 * getSystemPrompt method generates specific system Prompt according to Template and Context
 * getUserPrompt method generate a user message that is used to request the LLM according to Context
 * The subclass needs to rewrite the getSystemPrompt and getUserPrompt method to generate a specific Prompt
 */
export class Prompt<Context> implements IPrompt<Context> {
  template: string;

  constructor(template: string) {
    this.template = template;
  }
  getSystemPrompt(context: Context) {
    return this.template;
  }
  getUserPrompt(context: Context) {
    return this.template;
  }
}
