import { ApplicationMeta } from '../metaTypes';
import { BaseTaskNode } from '../taskNode/baseTaskNode';
import { ChatManager } from '../tools/chatManager';

export interface IApplication<Context, Spec> {
  tasks: { task: BaseTaskNode<Context, any>; name: string }[];
  context: Context;
  chatManager: ChatManager;

  registerTaskNodes: (tasks: ApplicationMeta) => void;

  runTasks: (context: Context) => Promise<Spec>;
  updateContext: (context: Context) => void;
}
