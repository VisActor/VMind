export interface ITaskNode<Context, DSL> {
  executeTask: (context: Context) => Promise<DSL> | DSL;
}
