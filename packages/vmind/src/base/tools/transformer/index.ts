/**
 * Transformer is to finish the data conversion work
 * * Generate a Result based on the Context
 * The subclass needs to rewrite the transform method to complete the specific data conversion
 */
export type Transformer<Context, Result> = (context: Context) => Result;
