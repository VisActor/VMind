import { TaskError } from 'src/common/typings';

export interface ITaskNode<Context, DSL> {
  name: string;
  type: TaskNodeType;
  context: Context;
  executeTask: (context: Context) => Promise<DSL | TaskError> | TaskError | DSL;
  updateContext: (context: Context) => void;
}
export enum TaskNodeType {
  RULE_BASED = 'rule-based',
  LLM_BASED = 'llm-based'
}
