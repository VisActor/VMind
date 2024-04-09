import { Transformer } from 'src/base/tools/transformer';
import { BaseTaskNode } from './base';

export class RuleBasedTaskNode<Input, Context, DSL> extends BaseTaskNode<Context, DSL> {
  input: Input;
  pipelines: Transformer<Input, Context, DSL>[];
  constructor(input: Input, context: Context, pipelines: Transformer<Input, Context, DSL>[]) {
    super(context);
    this.input = input;
    this.pipelines = pipelines;
  }

  executeTask() {
    const result: DSL = this.pipelines.reduce(
      (pre: Partial<DSL> | Input, transformer: Transformer<Partial<DSL> | Input, Context, DSL>) => {
        const result = transformer.transform(pre, this.context);
        return result;
      },
      this.input
    ) as DSL;
    return result;
  }
}
