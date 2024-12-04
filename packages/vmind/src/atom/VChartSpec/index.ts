import { AtomName } from '../../types/atom';
import type { BaseOptions } from '../type';
import { BaseAtom } from '../base';
import type { VChartSpecCtx } from '../../types';

export class VChartSpec extends BaseAtom<VChartSpecCtx, BaseOptions> {
  name = AtomName.VCHART_SPEC;

  isLLMAtom = false;

  constructor(context: VChartSpecCtx, option: BaseOptions) {
    super(context, option);
  }

  buildDefaultContext(context: VChartSpecCtx): VChartSpecCtx {
    return {
      ...context,
      spec: {}
    };
  }

  _runWithOutLLM(): VChartSpecCtx {
    // @todo @xile611 最终atom执行入口
    return this.context;
  }
}
