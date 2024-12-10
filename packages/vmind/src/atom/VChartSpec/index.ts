import { AtomName } from '../../types/atom';
import type { BaseOptions } from '../type';
import { BaseAtom } from '../base';
import type { VChartSpecCtx } from '../../types';
import { merge } from '@visactor/vutils';
import { set } from '../../utils/set';

const parseRealPath = (path: string, aliasKeyPath: string, spec: any) => {
  let appendSpec: any;

  if (aliasKeyPath) {
    const topKeyPath = aliasKeyPath.split('.')[0];
    const subPaths = path.split('.');

    if (subPaths[0] === 'axes[0]' || subPaths[0] === 'axes') {
      if (topKeyPath === 'xAxis') {
        appendSpec = { orient: 'bottom', aliasName: topKeyPath };
      } else if (topKeyPath === 'yAxis') {
        appendSpec = { orient: 'left', aliasName: topKeyPath };
      } else if (topKeyPath === 'radiusAxis') {
        appendSpec = { orient: 'radius', aliasName: topKeyPath };
      } else if (topKeyPath === 'angleAxis') {
        appendSpec = { orient: 'angle', aliasName: topKeyPath };
      } else if (topKeyPath === 'leftAxis') {
        appendSpec = { orient: 'left', aliasName: topKeyPath };
      } else if (topKeyPath === 'rightAxis') {
        appendSpec = { orient: 'right', aliasName: topKeyPath };
      } else if (topKeyPath === 'topAxis') {
        appendSpec = { orient: 'top', aliasName: topKeyPath };
      } else if (topKeyPath === 'bottomAxis') {
        appendSpec = { orient: 'bottom', aliasName: topKeyPath };
      }

      if (spec.axes) {
        let specifiedAxis = spec.axes.find((axis: any) => axis.aliasName === topKeyPath);

        if (!specifiedAxis) {
          if (topKeyPath === 'xAxis') {
            specifiedAxis = spec.axes.find((axis: any) => axis.orient === 'bottom');
          } else if (topKeyPath === 'yAxis') {
            specifiedAxis = spec.axes.find((axis: any) => axis.orient === 'left');
          } else if (topKeyPath === 'radiusAxis') {
            specifiedAxis = spec.axes.find((axis: any) => axis.orient === 'radius');
          } else if (topKeyPath === 'angleAxis') {
            specifiedAxis = spec.axes.find((axis: any) => axis.orient === 'angle');
          } else if (topKeyPath === 'leftAxis') {
            specifiedAxis = spec.axes.find((axis: any) => axis.orient === 'left');
          } else if (topKeyPath === 'rightAxis') {
            specifiedAxis = spec.axes.find((axis: any) => axis.orient === 'right');
          } else if (topKeyPath === 'topAxis') {
            specifiedAxis = spec.axes.find((axis: any) => axis.orient === 'top');
          } else if (topKeyPath === 'bottomAxis') {
            specifiedAxis = spec.axes.find((axis: any) => axis.orient === 'bottom');
          }
        }

        if (specifiedAxis) {
          const index = spec.axes.indexOf(specifiedAxis);

          subPaths[0] = `axes[${index}]`;
        } else {
          subPaths[0] = `axes[${spec.axes.length}]`;
        }
      }
    }

    return {
      appendPath: subPaths[0],
      appendSpec,
      path: subPaths.join('.')
    };
  }

  return { path };
};

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

      set(newSpec, aliasResult.path ?? parentKeyPath, leafSpec);
    } else {
      newSpec = leafSpec;
    }
    this.context.prevSpec = this.context.spec;
    this.context.spec = newSpec;

    return this.context;
  }
}
