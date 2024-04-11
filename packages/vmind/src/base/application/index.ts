import { ILLMOptions } from 'src/typings';
import { ApplicationMeta, LLMBasedTaskNodeMeta, RuleBasedTaskNodeMeta, TaskNode } from '../metaTypes';
import { BaseTaskNode } from '../taskNode/baseTaskNode';
import LLMBasedTaskNode from '../taskNode/llmBasedTaskNode';
import { TaskNodeType } from '../taskNode/types';
import { ChatManager } from '../tools/chatManager';
import { IApplication } from './types';
import { RuleBasedTaskNode } from '../taskNode/ruleBasedTaskNode';

/**
 * VMind application class, representing a specific function, such as chart generation, data aggregation, or chart editing, etc.
 * An Application consists of a series of TaskNodes. TaskNodes are executed in order, obtaining the final result (Spec).
 * Application can be seen as a collection of a series of TaskNodes. Applications can reference each other (equivalent to reusing TaskNodes to complete tasks)
 */
export class BaseApplication<Context, DSL> implements IApplication<Context, DSL> {
  name: string;
  tasks: { task: BaseTaskNode<Context, any>; name: string }[];
  context: Context;
  chatManager: ChatManager;
  constructor(meta: ApplicationMeta<any, any>) {
    this.chatManager = new ChatManager();
    this.name = meta.name;
    this.registerTaskNodes(meta);
  }

  /**
   * register the task nodes of this application
   *
   * @param meta meta information of this application
   */
  registerTaskNodes(meta: ApplicationMeta<any, any>) {
    const taskNodeInstanceList = meta.taskNodes.map((taskInfo: TaskNode<Context>) => {
      const { taskNode, name } = taskInfo;
      const { type } = taskNode;
      if (type === TaskNodeType.LLM_BASED) {
        const { modelType, parser, patcher, prompt, requester } = taskNode as LLMBasedTaskNodeMeta<Context, DSL>;
        return {
          name,
          task: new LLMBasedTaskNode<any, DSL>({ modelType, parser, patcher, prompt, requester })
        };
      } else if (type === TaskNodeType.RULE_BASED) {
        const { pipelines } = taskNode as RuleBasedTaskNodeMeta<Context, DSL>;
        return {
          name,
          task: new RuleBasedTaskNode(pipelines)
        };
      }
      return {} as { task: BaseTaskNode<Context, any>; name: string };
    });
    this.tasks = taskNodeInstanceList;
  }

  /**
   * run the task nodes of this application
   * The output results of the preceding nodes are treated as the context of all subsequent nodes.
   * @param context initial context of this application
   * @returns DSL
   */
  async runTasks(context: Context) {
    this.updateContext(context);

    const handler = async (pre: any, curTask: { name: string; task: BaseTaskNode<Context, any> }) => {
      console.log(curTask.name);
      const result = await curTask.task.executeTask(this.context);
      console.log(result);
      //Put the running result of the current node into the context.
      this.updateContext({
        ...this.context,
        ...result
      });
      return this.context;
    };

    const result: DSL = await asyncReduce(this.tasks, handler, this.context);
    return result;
  }

  updateContext(context: Context) {
    this.context = context;
  }
}
async function asyncReduce(array: any[], handler: Function, initialValue: any) {
  let result = initialValue;

  for (const item of array) {
    result = await handler(result, item);
  }

  return result;
}
