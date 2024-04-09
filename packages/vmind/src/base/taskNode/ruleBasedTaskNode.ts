import { Transformer } from 'src/base/tools/transformer';
import { BaseTaskNode } from './baseTaskNode';

/**
 * rule-based taskNode, which consists of a series of Pipelines
 * It completes the transformation from Input to a specific data structure (DSL)
 */
export class RuleBasedTaskNode<Input, Context extends { input: Input }, DSL> extends BaseTaskNode<Context, DSL> {
  pipelines: Transformer<Input, Context, DSL>[];
  constructor(pipelines: Transformer<Input, Context, DSL>[]) {
    super();
    this.pipelines = pipelines;
  }

  executeTask(context: Context) {
    const { input } = context;
    const result: DSL = this.pipelines.reduce(
      (pre: Partial<DSL> | Input, transformer: Transformer<Partial<DSL> | Input, Context, DSL>) => {
        const result = transformer.transform(pre, context);
        return result;
      },
      input
    ) as DSL;
    return result;
  }
}
