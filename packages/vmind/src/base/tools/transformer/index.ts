import { ITransformer } from './types';

/**
 * Transformer is to finish the data conversion work
 * * Convert the INPUT type to DSL type based on the Context
 * The subclass needs to rewrite the transform method to complete the specific data conversion
 */
export class Transformer<Input, Context, DSL> implements ITransformer<Input, Context, DSL> {
  transform(input: Input, context: Context): DSL {
    return input as unknown as DSL;
  }
}
