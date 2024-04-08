export interface ITransformer<I, T, DSL> {
  input: I;
  context: T;
  output: DSL;
  transform: () => DSL;
}
