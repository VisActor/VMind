export interface ITransformer<Input, Context, DSL> {
  transformFunc: (input: Input, context: Context) => DSL;
  transform: (input: Input, context: Context) => DSL;
}
