import { ApplicationMeta } from '../metaTypes';
import { BaseTaskNode } from '../taskNode/baseTaskNode';
import { ChatManager } from '../tools/chatManager';

export interface IApplication<Context, Spec> {
  name: string;
  tasks: { task: BaseTaskNode<Context, any>; name: string }[];
  context: Context;
  chatManager: ChatManager;

  registerTaskNodes: (meta: ApplicationMeta<any, any>) => void;

  runTasks: (context: Context) => Promise<Spec>;
  updateContext: (context: Context) => void;
}
