export interface ITaskNode<Context, DSL> {
  type: TaskNodeType;
  context: Context;
  executeTask: (context: Context) => Promise<DSL> | DSL;
  updateContext: (context: Context) => void;
}
export enum TaskNodeType {
  RULE_BASED = 'rule-based',
  LLM_BASED = 'llm-based'
}
