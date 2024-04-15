import { pick } from 'lodash';
import { SUPPORTED_CHART_LIST } from 'src/applications/chartGeneration/constants';
import {
  Cell,
  GenerateChartAndFieldMapContext,
  GenerateChartAndFieldMapOutput
} from 'src/applications/chartGeneration/types';
import { Parser } from 'src/base/tools/parser';
import { Requester } from 'src/base/tools/requester';
import { parseGPTResponse, requestGPT } from 'src/common/utils/gpt';
import { ChartType } from 'src/typings';

type GPTChartAdvisorResult = {
  CHART_TYPE: ChartType;
  DOUBLE_CHECK: string;
  FIELD_MAP: Cell;
  THOUGHT: string;
  VIDEO_DURATION?: number;
  COLOR_PALETTE?: string[];
  error?: boolean;
};

export const parseChartGenerationResponse: Parser<GenerateChartAndFieldMapContext, GenerateChartAndFieldMapOutput> = (
  advisorRes: any
) => {
  const advisorResJson: GPTChartAdvisorResult = parseGPTResponse(advisorRes) as unknown as GPTChartAdvisorResult;

  if (advisorResJson.error) {
    throw Error((advisorResJson as any).message);
  }
  if (!SUPPORTED_CHART_LIST.includes(advisorResJson['CHART_TYPE'])) {
    throw Error('Unsupported Chart Type. Please Change User Input');
  }
  const { CHART_TYPE, FIELD_MAP } = advisorResJson;

  return { chartType: CHART_TYPE.toUpperCase(), cell: FIELD_MAP, usage: advisorRes.usage };
};

const patchUserInput = (userInput: string) => {
  const FULL_WIDTH_SYMBOLS = ['，', '。'];
  const HALF_WIDTH_SYMBOLS = [',', '.'];

  const BANNED_WORD_LIST = ['动态'];
  const ALLOWED_WORD_LIST = ['动态条形图', '动态柱状图', '动态柱图'];
  const PLACEHOLDER = '_USER_INPUT_PLACE_HOLDER';
  const tempStr1 = ALLOWED_WORD_LIST.reduce((prev, cur, index) => {
    return prev.split(cur).join(PLACEHOLDER + '_' + index);
  }, userInput);
  const tempStr2 = BANNED_WORD_LIST.reduce((prev, cur) => {
    return prev.split(cur).join('');
  }, tempStr1);
  const replacedStr = ALLOWED_WORD_LIST.reduce((prev, cur, index) => {
    return prev.split(PLACEHOLDER + '_' + index).join(cur);
  }, tempStr2);

  let finalStr = HALF_WIDTH_SYMBOLS.reduce((prev, cur, index) => {
    return prev.split(HALF_WIDTH_SYMBOLS[index]).join(FULL_WIDTH_SYMBOLS[index]);
  }, replacedStr);
  const lastCharacter = finalStr[finalStr.length - 1];
  if (!FULL_WIDTH_SYMBOLS.includes(lastCharacter) && !HALF_WIDTH_SYMBOLS.includes(lastCharacter)) {
    finalStr += '。';
  }
  finalStr += 'Use the original fieldName and DO NOT change or translate any word of the data fields in the response.';
  return finalStr;
};

export const chartGenerationRequestLLM: Requester<GenerateChartAndFieldMapContext> = async (
  prompt: string,
  context: GenerateChartAndFieldMapContext
) => {
  const { userInput: userInputOrigin, llmOptions, vizSchema } = context;
  const userInput = patchUserInput(userInputOrigin);

  const filteredFields = vizSchema.fields
    .filter(
      field => field.visible
      //usefulFields.includes(field.fieldName)
    )
    .map(field => ({
      ...pick(field, ['id', 'description', 'type', 'role'])
    }));
  const chartAdvisorMessage = `User Input: ${userInput}\nData field description: ${JSON.stringify(filteredFields)}`;
  //call GPT
  const requestFunc = llmOptions.customRequestFunc?.chartAdvisor ?? requestGPT;

  const advisorRes = await requestFunc(prompt, chartAdvisorMessage, llmOptions);

  return advisorRes;
};
