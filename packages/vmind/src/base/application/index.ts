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
  tasks: { task: BaseTaskNode<Context, any>; name: string }[];
  context: Context;
  chatManager: ChatManager;
  constructor(taskNodeList: ApplicationMeta) {
    this.chatManager = new ChatManager();
    this.registerTaskNodes(taskNodeList);
  }

  registerTaskNodes(taskNodeList: ApplicationMeta) {
    const taskNodeInstanceList = taskNodeList.map((taskInfo: TaskNode<Context>) => {
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
    });
    this.tasks = taskNodeInstanceList;
  }

  async runTasks(context: Context) {
    this.updateContext(context);
    const result: DSL = this.tasks.reduce(
      async (pre: any, curTask: { name: string; task: BaseTaskNode<Context, any> }) => {
        const result = await curTask.task.executeTask(this.context);
        this.updateContext({
          ...this.context,
          ...result
        });
        return this.context;
      },
      this.context
    );
    return result;
  }

  updateContext(context: Context) {
    this.context = context;
  }
}
