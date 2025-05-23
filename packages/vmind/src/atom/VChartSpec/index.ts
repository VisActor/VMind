import { AtomName } from '../../types/atom';
import { BaseAtom } from '../base';
import type { BaseOptions, VChartSpecCtx } from '../../types';
import { runOperactionsOfSpec } from './utils';
import { Factory } from '../../core/factory';
import type { BaseAtomConstructor } from '../../types';

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
    const { prevSpec, originalSpec, operations } = this.context;
    const baseSpec = prevSpec ?? originalSpec;

    if (!operations || !operations.length) {
      this.context.spec = baseSpec;

      return this.context;
    }
    const { spec: newSpec } = runOperactionsOfSpec(baseSpec, operations);

    this.context.prevSpec = baseSpec;
    this.context.spec = newSpec;

    return this.context;
  }
}

export const registerVChartSpecAtom = () => {
  Factory.registerAtom(AtomName.VCHART_SPEC, VChartSpec as unknown as BaseAtomConstructor<VChartSpecCtx, BaseOptions>);
};
