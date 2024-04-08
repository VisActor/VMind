import { IPrompt } from './types';

export class Prompt<T> implements IPrompt<T> {
  template: string;
  context: T;

  constructor(template: string, context: T) {
    this.template = template;
    this.context = context;
  }
  getPrompt() {
    return this.template;
  }
}
