import { Transformer } from 'src/base/tools/transformer';
import { BaseTaskNode } from './baseTaskNode';

/**
 * rule-based taskNode, which consists of a series of Pipelines
 * It completes the transformation from Input to a specific data structure (DSL)
 */
export class RuleBasedTaskNode<Context, Result> extends BaseTaskNode<Context, Result> {
  pipelines: Transformer<any, Context, any>[];
  constructor(pipelines: Transformer<any, Context, any>[]) {
    super();
    this.pipelines = pipelines;
  }

  executeTask(context: Context): Result {
    this.updateContext(context);
    const result: Result = this.pipelines.reduce((pre: any, transformer: Transformer<any, Context, any>) => {
      const res = transformer(pre, context);
      return res;
    }, context);
    return result;
  }
}
