import { ITaskNode } from './types';

/**
 * A task node in VMind application, used to complete a specific task, such as requesting a large model for chart type, DSL parsing and conversion, etc.
 * There are 2 types: rule-based or LLM-based, the former completes a series of tasks based on rule algorithm, the latter calls LLM to complete the task.
 * Each Node can also be called as a separate function
 */
export class BaseTaskNode<Context, DSL> implements ITaskNode<Context, DSL> {
  executeTask(context: Context): Promise<DSL> | DSL {
    return null as DSL;
  }
}
