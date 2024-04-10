export interface ITaskNode<Context, DSL> {
  context: Context;
  executeTask: (context: Context) => Promise<DSL> | DSL;
  updateContext: (context: Context) => void;
}
