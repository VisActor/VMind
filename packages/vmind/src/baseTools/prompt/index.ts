import { IPrompt } from './types';
/**
 * Prompt represents a LLM Prompt
 * Pass in Template when initialization
 * getPrompt method generates specific Prompt according to Template and Context
 * The subclass needs to rewrite the getprompt method to generate a specific Prompt
 */
export class Prompt<Context> implements IPrompt<Context> {
  template: string;

  constructor(template: string) {
    this.template = template;
  }
  getPrompt(context: Context) {
    return this.template;
  }
}
