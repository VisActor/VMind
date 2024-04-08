import { ITransformer } from './types';

export class Transformer<Input, Context, DSL> implements ITransformer<Input, Context, DSL> {
  transform(input: Input, context: Context): DSL {
    return input as unknown as DSL;
  }
}
