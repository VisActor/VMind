import { SUPPORTED_CHART_LIST } from '../../common/vizDataToSpec/constants';
import { DataItem, GPTChartAdvisorResult, ILLMOptions, LOCATION, SimpleFieldInfo, VizSchema } from '../../typings';
import { checkChartTypeAndCell, vizDataToSpec } from '../../common/vizDataToSpec';
import { parseGPTResponse, requestGPT } from '../utils';
import { patchChartTypeAndCell, patchUserInput } from './utils';
import { ChartAdvisorPromptEnglish } from './prompts';
import { chartAdvisorHandler } from '../../common/chartAdvisor';
import { estimateVideoTime } from '../../common/vizDataToSpec/utils';
import { getSchemaFromFieldInfo } from '../../common/schema';
import { queryDatasetWithGPT } from '../dataProcess/query/queryDataset';
import { calculateTokenUsage } from '../..//common/utils';
import { pick } from 'lodash';

export const generateChartWithGPT = async (
  userPrompt: string, //user's intent of visualization, usually aspect in data that they want to visualize
  propsFieldInfo: SimpleFieldInfo[],
  propsDataset: DataItem[],
  options: ILLMOptions,
  enableDataQuery = true,
  colorPalette?: string[],
  animationDuration?: number
) => {
  const colors = colorPalette;
  let queryDatasetUsage;
  let advisorUsage;
  let chartType;
  let cell;
  let dataset: DataItem[] = propsDataset;
  let fieldInfo: SimpleFieldInfo[] = propsFieldInfo;
  let chartSource: string = options.model;

  try {
    if (enableDataQuery) {
      const {
        dataset: queryDataset,
        fieldInfo: fieldInfoNew,
        usage
      } = await queryDatasetWithGPT(userPrompt, fieldInfo, propsDataset, options);
      dataset = queryDataset;
      fieldInfo = fieldInfoNew;
      queryDatasetUsage = usage;
    }
  } catch (err) {
    console.error('data query error!');
    console.error(err);
  }

  const schema = getSchemaFromFieldInfo(fieldInfo);
  try {
    const userInputFinal = patchUserInput(userPrompt);
    const resJson: any = await chartAdvisorGPT(schema, userInputFinal, options);

    const chartTypeRes = resJson['CHART_TYPE'].toUpperCase();
    const cellRes = resJson['FIELD_MAP'];
    advisorUsage = resJson['usage'];
    const patchResult = patchChartTypeAndCell(chartTypeRes, cellRes, dataset);
    if (checkChartTypeAndCell(patchResult.chartTypeNew, patchResult.cellNew, fieldInfo)) {
      chartType = patchResult.chartTypeNew;
      cell = patchResult.cellNew;
    }
  } catch (err) {
    console.warn(err);
    console.warn('LLM generation error, use rule generation.');
    // call rule-based method to get recommended chart type and fieldMap(cell)
    const advisorResult = chartAdvisorHandler(schema, dataset);
    chartType = advisorResult.chartType;
    cell = advisorResult.cell;
    dataset = advisorResult.dataset as DataItem[];
    chartSource = 'chartAdvisor';
  }
  const spec = vizDataToSpec(
    dataset,
    chartType,
    cell,
    colors,
    animationDuration ? animationDuration * 1000 : undefined
  );
  spec.background = '#00000033';
  console.info(spec);
  return {
    chartSource,
    spec,
    chartType,
    time: estimateVideoTime(chartType, spec, animationDuration ? animationDuration * 1000 : undefined),
    usage: calculateTokenUsage([queryDatasetUsage, advisorUsage])
  };
};

/**
 * call GPT to get recommended chart type and fieldMap
 * @param schema VizSchema
 * @param userInput user input about their intention
 * @param options vmind options
 * @returns
 */
export const chartAdvisorGPT = async (
  schema: Partial<VizSchema>,
  userInput: string,
  options: ILLMOptions | undefined
) => {
  //call GPT
  const filteredFields = schema.fields
    .filter(
      field => field.visible
      //usefulFields.includes(field.fieldName)
    )
    .map(field => ({
      ...pick(field, ['id', 'description', 'type', 'role'])
    }));
  const chartAdvisorMessage = `User Input: ${userInput}\nData field description: ${JSON.stringify(filteredFields)}`;

  const requestFunc = options.customRequestFunc?.chartAdvisor ?? requestGPT;

  const advisorRes = await requestFunc(ChartAdvisorPromptEnglish(options.showThoughts), chartAdvisorMessage, options);

  const advisorResJson: GPTChartAdvisorResult = parseGPTResponse(advisorRes) as unknown as GPTChartAdvisorResult;

  if (advisorResJson.error) {
    throw Error((advisorResJson as any).message);
  }
  if (!SUPPORTED_CHART_LIST.includes(advisorResJson['CHART_TYPE'])) {
    throw Error('Unsupported Chart Type. Please Change User Input');
  }

  return { ...advisorResJson, usage: advisorRes.usage };
};
