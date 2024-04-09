/**
 * Transformer is to finish the data conversion work
 * * Convert the INPUT type to DSL type based on the Context
 * The subclass needs to rewrite the transform method to complete the specific data conversion
 */
export type Transformer<Input, Context, Result> = (input: Input, context: Context) => Result;
