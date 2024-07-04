import type { ApplicationMeta } from '../metaTypes';
import type { BaseTaskNode } from '../taskNode/baseTaskNode';
import type { ChatManager } from '../tools/chatManager';

export interface IApplication<Context, Spec> {
  name: string;
  tasks: { task: BaseTaskNode<Context, any>; name: string }[];
  context: Context;
  chatManager: ChatManager;

  registerTaskNodes: (meta: ApplicationMeta<any, any>) => void;

  runTasks: (context: Context) => Promise<Spec>;
  updateContext: (context: Context) => void;
}
