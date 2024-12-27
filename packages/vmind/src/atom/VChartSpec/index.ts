import { AtomName } from '../../types/atom';
import type { BaseOptions } from '../type';
import { BaseAtom } from '../base';
import type { VChartSpecCtx } from '../../types';
import { merge } from '@visactor/vutils';
import { set } from '../../utils/set';
import { parseRealPath, reduceDuplicatedPath } from './utils';

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

    if (!appendSpec || !appendSpec.leafSpec) {
      return this.context;
    }
    const { leafSpec, parentKeyPath = '', aliasKeyPath = '' } = appendSpec;
    let newSpec = merge({}, this.context.spec);

    if (parentKeyPath) {
      const aliasResult = parseRealPath(parentKeyPath, aliasKeyPath, newSpec);

      if (aliasResult.appendSpec && aliasResult.appendPath) {
        set(newSpec, aliasResult.appendPath, aliasResult.appendSpec);
      }

      const finalParentKeyPath = aliasResult.path ?? parentKeyPath;

      set(newSpec, finalParentKeyPath, reduceDuplicatedPath(finalParentKeyPath, leafSpec));

      this.context.appendCode = 0;
    } else {
      newSpec = merge(newSpec, leafSpec);
      this.context.appendCode = 0;
    }
    this.context.prevSpec = this.context.spec;
    this.context.spec = newSpec;

    return this.context;
  }
}
