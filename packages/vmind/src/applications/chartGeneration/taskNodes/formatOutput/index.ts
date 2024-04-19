import type { ChartGenerationContext, ChartGenerationOutput } from 'src/applications/types';
import type { RuleBasedTaskNodeMeta } from 'src/base/metaTypes';
import { TaskNodeType } from 'src/base/taskNode/types';
import type { Transformer } from 'src/base/tools/transformer';
import { ChartType } from 'src/common/typings';
import { estimateVideoTime } from 'src/common/utils/utils';

const chartTypeMap = Object.keys(ChartType).reduce((prev, cur) => {
  const value = ChartType[cur];
  prev[value.toUpperCase()] = value;
  return prev;
}, {});

const formatChartGenerationOutput: Transformer<
  ChartGenerationContext & ChartGenerationOutput,
  Partial<ChartGenerationOutput>
> = (context: ChartGenerationContext & ChartGenerationOutput) => {
  const { spec, totalTime, chartType } = context;

  return {
    chartType: chartTypeMap[chartType] ?? chartType,
    time: estimateVideoTime(chartType, spec, totalTime ? totalTime * 1000 : undefined)
  };
};

const FormatOutputTaskNodeMeta: RuleBasedTaskNodeMeta<ChartGenerationOutput, ChartGenerationOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [formatChartGenerationOutput]
};

export default FormatOutputTaskNodeMeta;
