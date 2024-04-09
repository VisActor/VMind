import { BaseTaskNode } from '../taskNode/baseTaskNode';
import { ChatManager } from '../tools/chatManager';

export interface IApplication<Context, Spec> {
  tasks: {
    name: string;
    task: BaseTaskNode<Context, any>;
  }[];
  context: Context;
  chatManager: ChatManager;

  runTasks: () => Promise<Spec>;
  updateContext: (context: Context) => void;
}
