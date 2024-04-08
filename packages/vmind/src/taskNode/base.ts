import { ITaskNode } from './types';

export class BaseTaskNode<Context, DSL> implements ITaskNode<Context, DSL> {
  context: Context;
  output: DSL;
  constructor(context: Context) {
    this.context = context;
  }

  executeTask() {
    return this.output as any;
  }
}
