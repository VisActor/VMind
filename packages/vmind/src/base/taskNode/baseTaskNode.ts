import { ITaskNode } from './types';

/**
 * A task node in VMind application, used to complete a specific task, such as requesting a large model for chart type, DSL parsing and conversion, etc.
 * There are 2 types: rule-based or LLM-based, the former completes a series of tasks based on rule algorithm, the latter calls LLM to complete the task.
 * TaskNode can be seen as a collection of a series of tools, responsible for completing a specific task.
 * Each Node can also be called as a separate function
 */
export class BaseTaskNode<Context, Result> implements ITaskNode<Context, Result> {
  context: Context;

  executeTask(context: Context): Promise<Result> | Result {
    this.updateContext(context);
    return null as Result;
  }
  updateContext(context: Context) {
    this.context = context;
  }
}
