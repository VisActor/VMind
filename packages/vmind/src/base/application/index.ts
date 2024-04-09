import { BaseTaskNode } from '../taskNode/baseTaskNode';
import { ChatManager } from '../tools/chatManager';
import { IApplication } from './types';

/**
 * VMind application class, representing a specific function, such as chart generation, data aggregation, or chart editing, etc.
 * An Application consists of a series of TaskNodes. TaskNodes are executed in order, obtaining the final result (Spec).
 * Application can be seen as a collection of a series of TaskNodes. Applications can reference each other (equivalent to reusing TaskNodes to complete tasks)
 */
export class BaseApplication<Context, DSL> implements IApplication<Context, DSL> {
  tasks: BaseTaskNode<Context, any>[];
  context: Context;
  chatManager: ChatManager;
  constructor(tasks: BaseTaskNode<Context, any>[], context: Context) {
    this.tasks = tasks;
    this.context = context;
    this.chatManager = new ChatManager();
  }

  async runTasks() {
    const result: DSL = this.tasks.reduce(async (pre: any, task: BaseTaskNode<Context, any>) => {
      const result = await task.executeTask(pre);
      return result;
    }, this.context);
    return result;
  }

  updateContext(context: Context) {
    this.context = context;
  }
}
