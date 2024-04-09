import { ITransformer } from './types';

/**
 * Transformer is to finish the data conversion work
 * * Convert the INPUT type to DSL type based on the Context
 * The subclass needs to rewrite the transform method to complete the specific data conversion
 */
export class Transformer<Input, Context, DSL> implements ITransformer<Input, Context, DSL> {
  transformFunc: (input: Input, context: Context) => DSL;
  constructor(transFunc: (input: Input, context: Context) => DSL) {
    this.transformFunc = transFunc;
  }
  transform(input: Input, context: Context): DSL {
    return this.transformFunc(input, context);
  }
}
