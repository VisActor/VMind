export interface ITransformer<Input, Context, DSL> {
  transform: (input: Input, context: Context) => DSL;
}
