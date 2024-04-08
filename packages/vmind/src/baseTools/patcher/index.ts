import { IPatcher } from './types';
import { Transformer } from '../transformer';

export class Patcher<T, C> implements IPatcher<T, C> {
  input: T;
  output: T;
  context: C;
  pipelines: Transformer<T, C, T>[];
  constructor(input: T, context: C, transformers: Transformer<T, C, T>[]) {
    this.input = input;
    this.context = context;
    this.pipelines = transformers;
  }

  patch() {
    const result = this.pipelines.reduce((pre: Partial<T>, transformer: Transformer<T, C, T>) => {
      const result = transformer.transform();
      return result;
    }, this.input);
    return result;
  }
}
