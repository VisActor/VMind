import { Transformer } from 'src/base/tools/transformer';
import { BaseTaskNode } from './baseTaskNode';
import { TaskNodeType } from './types';
import { TaskError } from 'src/common/typings';
import { getObjectProperties } from 'src/common/utils/utils';
import { isFunction } from 'lodash';

/**
 * rule-based taskNode, which consists of a series of Pipelines
 * It completes the transformation from Input to a specific data structure (DSL)
 */
export class RuleBasedTaskNode<Context, Result> extends BaseTaskNode<Context, Result> {
  pipelines: Transformer<Context, Result>[] | ((context: Context) => Transformer<Context, Result>[]);
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
    let pipelines = this.pipelines;
    if (isFunction(this.pipelines)) {
      pipelines = this.pipelines(context);
    }

    try {
      const result: Result = (pipelines as Transformer<Context, Result>[]).reduce(
        (pre: any, transformer: Transformer<Context, Result>) => {
          const res = transformer(pre);
          return { ...pre, ...res };
        },
        context
      );
      return result;
    } catch (e: any) {
      console.error(`${this.name} error!`);
      //throw e
      return {
        ...getObjectProperties(e),
        error: true
      };
    }
  }
}
