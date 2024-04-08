export interface ITransformer<I, Context, DSL> {
  transform: (input: I, context: Context) => DSL;
}
