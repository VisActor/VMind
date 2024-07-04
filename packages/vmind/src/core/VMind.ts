import { _chatToVideoWasm } from '../chart-to-video';
import type {
  ILLMOptions,
  TimeType,
  SimpleFieldInfo,
  DataItem,
  OuterPackages,
  VMindDataset,
  ChartType
} from '../common/typings';
import { Model, ModelType } from '../common/typings';
import { getFieldInfoFromDataset, parseCSVData as parseCSVDataWithRule } from '../common/dataProcess';
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
import { SUPPORTED_CHART_LIST } from '../applications/chartGeneration/constants';
import { BaseApplication } from '../base/application';
import { fillSpecTemplateWithData } from '../common/specUtils';
import type { ApplicationMeta, TaskNode } from '../base/metaTypes';
import type { DataExtractionContext, DataExtractionOutput } from '../applications/types';

type MetaMapByModel = { [key: ModelType | string]: ApplicationMeta<any, any> };

type RuntimeMetaMap = {
  [key: string]: MetaMapByModel;
};
class VMind {
  private _FPS = 30;
  private _options: ILLMOptions | undefined;
  private _model: Model | string;
  private _applicationMap: VMindApplicationMap;
  private _runtimeMetaMap: RuntimeMetaMap;

  constructor(options?: ILLMOptions) {
    this._options = { ...(options ?? {}), showThoughts: options?.showThoughts ?? true }; //apply default settings
    this._model = options?.model ?? Model.GPT3_5;
    this._runtimeMetaMap = applicationMetaList;
    this.registerApplications();
  }

  private registerApplications() {
    const applicationList: any = {};
    Object.keys(this._runtimeMetaMap).forEach(applicationName => {
      applicationList[applicationName] = {};
      const applicationMetaByModel: any = this._runtimeMetaMap[applicationName as ApplicationType];
      Object.keys(applicationMetaByModel).forEach(modelType => {
        const applicationMeta = applicationMetaByModel[modelType];
        applicationList[applicationName][modelType] = new BaseApplication(applicationMeta);
      });
    });
    this._applicationMap = applicationList;
  }

  addApplication(applicationMeta: ApplicationMeta<any, any>, modelType: ModelType | string) {
    const { name } = applicationMeta;
    if (!this._applicationMap[name]) {
      this._applicationMap[name] = {};
    }
    this._applicationMap[name][modelType] = new BaseApplication(applicationMeta);
    return;
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
  parseCSVData(csvString: string): { fieldInfo: SimpleFieldInfo[]; dataset: DataItem[] } {
    //Parse CSV Data without LLM
    //return dataset and fieldInfo
    return parseCSVDataWithRule(csvString);
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

  async dataQuery(
    userPrompt: string, //user's intent of visualization, usually aspect in data that they want to visualize
    fieldInfo: SimpleFieldInfo[],
    dataset: DataItem[]
  ): Promise<DataAggregationOutput> {
    const modelType = this.getModelType();
    const context: DataAggregationContext = {
      userInput: userPrompt,
      fieldInfo,
      sourceDataset: dataset,
      llmOptions: this._options
    };
    return await this.runApplication(ApplicationType.DataAggregation, modelType, context);
  }

  /**
   *
   * @param userPrompt user's visualization intention (what aspect they want to show in the data)
   * @param fieldInfo information about fields in the dataset. field name, type, etc. You can get fieldInfo using parseCSVData or parseCSVDataWithLLM
   * @param dataset raw dataset used in the chart. It can be empty and will return a spec template in this case. User can call fillSpecTemplateWithData to fill data into spec template.
   * @param colorPalette color palette of the chart
   * @param animationDuration duration of chart animation.
   * @param chartTypeList supported chart list. VMind will generate a chart among this list.
   * @returns spec and time duration of the chart.
   */
  async generateChart(
    userPrompt: string, //user's intent of visualization, usually aspect in data that they want to visualize
    fieldInfo: SimpleFieldInfo[],
    dataset?: VMindDataset,
    options?: {
      chartTypeList?: ChartType[];
      colorPalette?: string[];
      animationDuration?: number;
      enableDataQuery?: boolean;
    }
  ): Promise<ChartGenerationOutput> {
    const modelType = this.getModelType();
    let finalDataset = dataset;
    let finalFieldInfo = fieldInfo;

    let queryDatasetUsage;
    const { enableDataQuery, colorPalette, animationDuration, chartTypeList } = options ?? {};
    try {
      if (!isNil(dataset) && (isNil(enableDataQuery) || enableDataQuery) && modelType !== ModelType.CHART_ADVISOR) {
        //run data aggregation first
        const dataAggregationContext: DataAggregationContext = {
          userInput: userPrompt,
          fieldInfo,
          sourceDataset: dataset,
          llmOptions: this._options
        };
        const {
          dataset: queryDataset,
          fieldInfo: fieldInfoNew,
          usage,
          error
        } = await this.runApplication(ApplicationType.DataAggregation, modelType, dataAggregationContext);
        if (!error) {
          finalDataset = queryDataset;
          finalFieldInfo = fieldInfoNew;
          queryDatasetUsage = usage;
        }
      }
    } catch (err) {
      console.error('data query error!');
      console.error(err);
    }
    const context: ChartGenerationContext = {
      userInput: userPrompt,
      fieldInfo: finalFieldInfo,
      dataset: finalDataset,
      llmOptions: this._options,
      colors: colorPalette,
      totalTime: animationDuration,
      chartTypeList: chartTypeList ?? SUPPORTED_CHART_LIST
    };

    const chartGenerationResult = await this.runApplication(ApplicationType.ChartGeneration, modelType, context);

    if (modelType === ModelType.CHART_ADVISOR) {
      return chartGenerationResult.advisedList;
    }

    const { chartType, spec, cell, chartSource, time } = chartGenerationResult;
    const usage = calculateTokenUsage([queryDatasetUsage, chartGenerationResult.usage]);
    return {
      //...chartGenerationResult,
      spec,
      usage,
      cell,
      chartSource,
      chartType,
      time
    };
  }

  async intelligentInsight(spec: any, options?: Partial<InsightContext>): Promise<InsightOutput> {
    const modelType = this.getModelType();
    const context: InsightContext = {
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
  fillSpecWithData(spec: any, dataset: VMindDataset, totalTime?: number) {
    return fillSpecTemplateWithData(spec, dataset, totalTime);
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
