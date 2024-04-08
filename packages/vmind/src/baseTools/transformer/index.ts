import { ITransformer } from './types';

export class Transformer<I, T, DSL> implements ITransformer<I, T, DSL> {
  input: I;
  context: T;
  output: DSL;
  constructor(input: I, context: T) {
    this.input = input;
    this.context = context;
  }

  transform() {
    return this.output;
  }
}
