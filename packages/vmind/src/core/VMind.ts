import { _chatToVideoWasm } from '../chart-to-video';
import type { TimeType, SimpleFieldInfo, OuterPackages, VMindDataset, ChartTheme } from '../common/typings';
import { Model, ModelType } from '../common/typings';
import type { VMindApplicationMap } from './types';
import type {
  ChartGenerationContext,
  ChartGenerationOutput,
  DataAggregationContext,
  DataAggregationOutput,
  InsightContext,
  InsightOutput
} from '../applications/types';
import applicationMetaList, { ApplicationType } from '../applications';
import { calculateTokenUsage } from '../common/utils/utils';
import { isNil } from '@visactor/vutils';
import { DEFAULT_MAP_OPTION, SUPPORTED_CHART_LIST } from '../applications/chartGeneration/constants';
import { BaseApplication } from '../base/application';
import type { ApplicationMeta, TaskNode } from '../base/metaTypes';
import type { DataExtractionContext, DataExtractionOutput } from '../applications/types';
import { LLMManage } from './llm';
import type {
  BasemapOption,
  ChartGeneratorCtx,
  ChartType,
  DataItem,
  DataTable,
  FieldInfo,
  ILLMOptions
} from '../types';
import { AtomName } from '../types';
import { getData2ChartSchedule } from '../applications/chartGeneration';
import type { Schedule } from '../schedule';
import { getFieldInfoFromDataset } from '../utils/field';
import { parseCSVData } from '../utils/dataTable';
import { fillSpecTemplateWithData } from '../utils/spec';

type MetaMapByModel = { [key: ModelType | string]: ApplicationMeta<any, any> };

type RuntimeMetaMap = {
  [key: string]: MetaMapByModel;
};
class VMind {
  private _FPS = 30;
  private _applicationMap: VMindApplicationMap;
  private _runtimeMetaMap: RuntimeMetaMap;
  private llm: LLMManage;
  private data2ChartSchedule:
    | Schedule<[AtomName.DATA_QUERY, AtomName.CHART_COMMAND, AtomName.CHART_GENERATE]>
    | Schedule<[AtomName.CHART_GENERATE]>;

  constructor(options?: ILLMOptions) {
    this.llm = new LLMManage(options);
    this.data2ChartSchedule = getData2ChartSchedule(this.llm, options);
  }

  updateOptions(options?: ILLMOptions) {
    this.llm.updateOptions(options);
  }

  setTaskNode(applicationName: string, modelType: ModelType | string, taskNode: TaskNode<any>) {
    const applicationMeta = this._runtimeMetaMap[applicationName]?.[modelType];
    if (applicationMeta) {
      const { taskNodes } = applicationMeta;
      const originalTaskNode = taskNodes.find(t => t.name === taskNode.name);
      if (originalTaskNode) {
        originalTaskNode.taskNode = taskNode.taskNode;
        this._applicationMap[applicationName][modelType] = new BaseApplication(applicationMeta);
      } else {
        throw 'task node name error!';
      }
    } else {
      throw 'application name error!';
    }
  }

  private getApplication(name: ApplicationType, modelType: ModelType) {
    return this._applicationMap[name][modelType];
  }

  private async runApplication(applicationName: ApplicationType, modelType: ModelType, context: any) {
    const application = this.getApplication(applicationName, modelType);
    return application.runTasks(context);
  }

  /**
   * Extract json format data from the text, and generate instructions that can be used for drawing
   */
  async extractDataFromText(
    dataText: string,
    userPrompt?: string,
    options?: {
      chartTypeList?: ChartType[];
    }
  ): Promise<DataExtractionOutput> {
    const modelType = this.getModelType();
    const { chartTypeList } = options ?? {};
    const context: DataExtractionContext = {
      userInput: userPrompt ?? '',
      dataText: dataText,
      llmOptions: this._options,
      chartTypeList: chartTypeList ?? SUPPORTED_CHART_LIST
    };
    return await this.runApplication(ApplicationType.DataExtraction, modelType, context);
  }

  /**
   * parse csv string and get the name, type of each field using rule-based method.
   * @param csvString csv data user want to visualize
   * @returns fieldInfo and raw dataset.
   */
  parseCSVData(csvString: string): { fieldInfo: FieldInfo[]; dataset: DataItem[] } {
    //Parse CSV Data without LLM
    //return dataset and fieldInfo
    return parseCSVData(csvString);
  }

  /**
   * get fieldInfo only by raw dataset
   * @param dataset
   * @returns fieldInfo
   */
  getFieldInfo(dataset: DataItem[]) {
    return getFieldInfoFromDataset(dataset);
  }

  private getModelType() {
    if (this._model.includes(ModelType.GPT)) {
      return ModelType.GPT;
    } else if (this._model.includes(ModelType.SKYLARK) || this._model.includes(ModelType.CUSTOM)) {
      return ModelType.SKYLARK;
    } else if (this._model.includes(ModelType.CHART_ADVISOR)) {
      return ModelType.CHART_ADVISOR;
    }
    return ModelType.SKYLARK;
  }

  /**
   *
   * @param userPrompt user's visualization intention (what aspect they want to show in the data)
   * @param fieldInfo information about fields in the dataset. field name, type, etc. You can get fieldInfo using parseCSVData or parseCSVDataWithLLM
   * @param dataset raw dataset used in the chart. It can be empty and will return a spec template in this case. User can call fillSpecTemplateWithData to fill data into spec template.
   * @param colorPalette color palette of the chart
   * @param animationDuration duration of chart animation.
   * @param chartTypeList supported chart list. VMind will generate a chart among this list.
   * @param basemapOption map chart's base map. Only use in map chart.
   * @returns spec and time duration of the chart.
   */
  async generateChart(
    userPrompt?: string, //user's intent of visualization, usually aspect in data that they want to visualize
    fieldInfo?: FieldInfo[],
    dataset?: DataTable,
    options?: {
      chartTypeList?: ChartType[];
      colorPalette?: string[];
      animationDuration?: number;
      enableDataQuery?: boolean;
      theme?: ChartTheme | string;
      basemapOption?: BasemapOption;
    }
  ): Promise<ChartGeneratorCtx> {
    const { enableDataQuery = false } = options || {};
    this.data2ChartSchedule.updateOptions({
      chartGenerate: {
        ...options
      }
    });
    this.data2ChartSchedule.updateContext({
      fieldInfo,
      dataTable: dataset,
      command: userPrompt
    });
    const shouldRunList: Record<string, boolean> = {
      [AtomName.DATA_QUERY]: enableDataQuery,
      [AtomName.CHART_COMMAND]: !userPrompt
    };
    const { chartAdvistorRes, spec, command, cell, vizSchema, dataTable, time } = await this.data2ChartSchedule.run(
      undefined,
      shouldRunList
    );
    return {
      spec,
      command,
      chartAdvistorRes,
      cell,
      vizSchema,
      dataTable,
      time
    };
  }

  async intelligentInsight(spec: any, options?: Partial<InsightContext>): Promise<InsightOutput> {
    const modelType = this.getModelType();
    const context = {
      spec,
      llmOptions: this._options,
      ...options
    };
    const { insights, spec: specWithInsight } = await this.runApplication(
      ApplicationType.IntelligentInsight,
      modelType,
      context
    );
    return { insights, spec: specWithInsight };
  }

  /**
   * user can generate a spec template without dataset in generateChart
   * fill the spec template with dataset.
   * @param spec
   * @param dataset
   * @returns
   */
  fillSpecWithData(spec: any, dataset: VMindDataset, cell?: any) {
    return fillSpecTemplateWithData(spec, dataset, cell);
  }

  async exportVideo(spec: any, time: TimeType, outerPackages: OuterPackages, mode?: 'node' | 'desktop-browser') {
    const { VChart, FFmpeg, fetchFile, ManualTicker } = outerPackages;
    const outName = `out`;
    await _chatToVideoWasm(this._FPS, spec, time, outName, outerPackages, mode);
    const data = FFmpeg.FS('readFile', `${outName}.mp4`);
    return data.buffer;
  }

  async exportGIF(spec: any, time: TimeType, outerPackages: OuterPackages, mode?: 'node' | 'desktop-browser') {
    const { VChart, FFmpeg, fetchFile } = outerPackages;
    const outName = `out`;
    await _chatToVideoWasm(this._FPS, spec, time, outName, outerPackages, mode);
    // 调色板
    await FFmpeg.run('-i', `${outName}.mp4`, '-filter_complex', '[0:v] palettegen', 'palette.png');
    await FFmpeg.run(
      '-i',
      `${outName}.mp4`,
      '-i',
      'palette.png',
      '-filter_complex',
      '[0:v][1:v] paletteuse',
      'out.gif'
    );
    const data = FFmpeg.FS('readFile', 'out.gif');
    return data.buffer;
  }
}

export default VMind;
