import { IPatcher } from './types';
import { Transformer } from '../transformer';

export class Patcher<T, Context> implements IPatcher<T, Context> {
  pipelines: Transformer<Partial<T>, Context, T>[];
  constructor(transformers: Transformer<Partial<T>, Context, T>[]) {
    this.pipelines = transformers;
  }

  patch(input: Partial<T>, context: Context) {
    const result: T = this.pipelines.reduce((pre: Partial<T>, transformer: Transformer<Partial<T>, Context, T>) => {
      const result = transformer.transform(pre, context);
      return result;
    }, input) as T;
    return result;
  }
}
