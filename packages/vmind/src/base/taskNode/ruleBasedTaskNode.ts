import { Transformer } from 'src/base/tools/transformer';
import { BaseTaskNode } from './baseTaskNode';
import { TaskNodeType } from './types';
import { TaskError } from 'src/typings';
import { getObjectProperties } from 'src/common/utils/utils';

/**
 * rule-based taskNode, which consists of a series of Pipelines
 * It completes the transformation from Input to a specific data structure (DSL)
 */
export class RuleBasedTaskNode<Context, Result> extends BaseTaskNode<Context, Result> {
  pipelines: Transformer<Context, Result>[];
  constructor(name: string, pipelines: Transformer<Context, Result>[]) {
    super(name);
    this.type = TaskNodeType.RULE_BASED;
    this.registerPipelines(pipelines);
  }

  registerPipelines(pipelines: Transformer<Context, Result>[]) {
    this.pipelines = pipelines;
  }

  /**
   * run the tasks using current context
   * @param context initial context
   * @returns
   */
  executeTask(context: Context): Result | TaskError {
    this.updateContext({ ...this.context, ...context });
    try {
      const result: Result = this.pipelines.reduce((pre: any, transformer: Transformer<Context, Result>) => {
        const res = transformer(pre);
        return { ...pre, ...res };
      }, context);
      return result;
    } catch (e: any) {
      console.error(`${this.name} error!`);
      return {
        ...getObjectProperties(e),
        error: true
      };
    }
  }
}
