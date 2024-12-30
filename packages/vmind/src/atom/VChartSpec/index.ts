import { AtomName } from '../../types/atom';
import type { BaseOptions } from '../type';
import { BaseAtom } from '../base';
import type { VChartSpecCtx } from '../../types';
import { mergeAppendSpec } from './utils';
import { isNil } from '@visactor/vutils';

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
    const { spec, appendSpec } = this.context;

    if (!spec) {
      this.context.spec = {};

      return this.context;
    }

    if (appendSpec && 'leafSpec' in appendSpec) {
      const { newSpec, code } = mergeAppendSpec(this.context.spec, appendSpec);

      this.context.appendCode = code;
      this.context.prevSpec = this.context.spec;
      this.context.spec = newSpec;
    }

    return this.context;
  }
}
