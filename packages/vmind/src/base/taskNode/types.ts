export interface ITaskNode<Input, Context, DSL> {
  executeTask: (input: Input, context: Context) => Promise<DSL> | DSL;
}
