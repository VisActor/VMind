import { BaseTaskNode } from '../taskNode/baseTaskNode';
import { ChatManager } from '../tools/chatManager';

export interface IApplication<Context, Spec> {
  tasks: BaseTaskNode<Context, any>[];
  context: Context;
  chatManager: ChatManager;

  runTasks: () => Promise<Spec>;
  updateContext: (context: Context) => void;
}
