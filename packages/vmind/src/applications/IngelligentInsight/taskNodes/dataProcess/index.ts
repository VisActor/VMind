import type { RuleBasedTaskNodeMeta } from '../../../../base/metaTypes';
import { TaskNodeType } from '../../../../base/taskNode/types';
import type { InsightContext, InsightOutput } from '../../../types';
import type { Transformer } from '../../../../base/tools/transformer';
import { getCellFromSpec, getChartTypeFromSpec, getDatasetFromSpec } from '../../../../common/specUtils';
import { getFieldInfoFromDataset } from '../../../../common/dataProcess';
import type { DataProcessOutput } from '../../types';

const extractDataFromContext: Transformer<InsightContext, DataProcessOutput> = (context: InsightContext) => {
  const { spec, fieldInfo: inputFieldInfo, cell: inputCell, dataset: inputDataset } = context;

  const chartType = getChartTypeFromSpec(spec);
  if (!chartType) {
    throw new Error('unsupported spec type');
  }
  let dataset = inputDataset;
  if (!dataset) {
    //no dataset in the input, extract from spec
    dataset = getDatasetFromSpec(spec);
  }
  let cell = inputCell;
  if (!cell) {
    cell = getCellFromSpec(spec);
  }

  let fieldInfo = inputFieldInfo;
  if (!fieldInfo) {
    fieldInfo = getFieldInfoFromDataset(dataset);
  }

  return { dataset, cell, fieldInfo, chartType };
};

// eslint-disable-next-line no-undef
const DataProcessTaskNodeMeta: RuleBasedTaskNodeMeta<InsightContext, InsightOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [extractDataFromContext]
};

export default DataProcessTaskNodeMeta;
