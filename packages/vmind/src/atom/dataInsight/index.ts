import type { DataInsightCtx } from '../../types/atom';
import { AtomName } from '../../types/atom';
import type { DataInsightOptions } from '../type';
import { BaseAtom } from '../base';
import { merge } from '@visactor/vutils';
import { extractDataFromContext } from './dataProcess';
import { AlgorithmType } from './type';
import { getInsights } from './algorithms';

export class DataInsightAtom extends BaseAtom<DataInsightCtx, DataInsightOptions> {
  name = AtomName.DATA_CLEAN;

  isLLMAtom: boolean = false;

  constructor(context: DataInsightCtx, option: DataInsightOptions) {
    super(context, option);
  }

  buildDefaultContext(context: DataInsightCtx): DataInsightCtx {
    return merge(
      {},
      {
        spec: {}
      },
      context
    );
  }

  buildDefaultOptions(): DataInsightOptions {
    return {
      algorithms: [
        AlgorithmType.OverallTrending,
        AlgorithmType.AbnormalTrend,
        AlgorithmType.PearsonCorrelation,
        AlgorithmType.SpearmanCorrelation,
        AlgorithmType.StatisticsAbnormal,
        AlgorithmType.LOFOutlier,
        AlgorithmType.DbscanOutlier,
        AlgorithmType.DifferenceOutlier,
        AlgorithmType.TurningPoint,
        AlgorithmType.Volatility
      ],
      isLimitedbyChartType: true
    };
  }

  shouldRunByContextUpdate(context: DataInsightCtx): boolean {
    return true;
  }

  protected runBeforeLLM(): DataInsightCtx {
    const dataInfo = extractDataFromContext(this.context);
    const { insights } = getInsights(dataInfo, this.options);
    const newContext = {
      ...this.context,
      insights
    };
    this.updateContext(newContext);
    return this.context;
  }
}
