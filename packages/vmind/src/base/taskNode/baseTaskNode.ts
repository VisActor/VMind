import type { TaskError } from '../../common/typings';
import type { ITaskNode, TaskNodeType } from './types';

/**
 * A task node in VMind application, used to complete a specific task, such as requesting a LLM for chart type, DSL parsing and conversion, etc.
 * There are 2 types: rule-based or LLM-based, the former completes a series of tasks based on rule algorithm, the latter calls LLM to complete the task.
 * TaskNode can be seen as a collection of a series of tools, responsible for completing a specific task.
 * Each Node can also be called as a separate function in VMind core
 * It can be described using TaskNodeMeta (see packages/vmind/src/base/metaTypes.ts)
 */
export class BaseTaskNode<Context, Result> implements ITaskNode<Context, Result> {
  name: string;
  context: Context;
  type: TaskNodeType;
  constructor(name: string) {
    this.name = name;
  }
  executeTask(context: Context): Promise<Result | TaskError> | TaskError | Result {
    this.updateContext({ ...this.context, ...context });
    return null as Result;
  }
  updateContext(context: Context) {
    this.context = context;
  }
}
