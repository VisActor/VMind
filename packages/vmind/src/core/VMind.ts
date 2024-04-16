import { _chatToVideoWasm } from '../chart-to-video';
import {
  ILLMOptions,
  TimeType,
  Model,
  SimpleFieldInfo,
  DataItem,
  OuterPackages,
  ModelType,
  VMindDataset
} from '../typings';
import { getFieldInfoFromDataset, parseCSVData as parseCSVDataWithRule } from '../common/dataProcess';
import { VMindApplicationMap } from './types';
import { BaseApplication } from 'src/base/application';
import {
  ChartGenerationContext,
  ChartGenerationOutput,
  DataAggregationContext,
  DataAggregationOutput
} from 'src/applications/types';
import applicationMetaList, { ApplicationType } from 'src/applications';
import { calculateTokenUsage, estimateVideoTime } from 'src/common/utils/utils';

class VMind {
  private _FPS = 30;
  private _options: ILLMOptions | undefined;
  private _model: Model | string;
  private _applicationMap: VMindApplicationMap;

  constructor(options?: ILLMOptions) {
    this._options = { ...(options ?? {}) };
    this._model = options.model ?? Model.GPT3_5;
    this.registerApplications();
  }

  private registerApplications() {
    const applicationList = {};
    Object.keys(applicationMetaList).forEach(applicationName => {
      applicationList[applicationName] = {};
      const applicationMetaByModel = applicationMetaList[applicationName];
      Object.keys(applicationMetaByModel).forEach(modelType => {
        const applicationMeta = applicationMetaByModel[modelType];
        applicationList[applicationName][modelType] = new BaseApplication(applicationMeta);
      });
    });
    this._applicationMap = applicationList;
  }

  public addApplication() {}

  private getApplication(name: ApplicationType, modelType: ModelType) {
    return this._applicationMap[name][modelType];
  }

  private async runApplication(applicationName: ApplicationType, modelType: ModelType, context: any) {
    const application = this.getApplication(applicationName, modelType);
    return application.runTasks(context);
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
    } else if (this._model.includes(ModelType.SKYLARK)) {
      return ModelType.SKYLARK;
    }
    return ModelType.CHART_ADVISOR;
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
  async generateChart(
    userPrompt: string, //user's intent of visualization, usually aspect in data that they want to visualize
    fieldInfo: SimpleFieldInfo[],
    dataset: VMindDataset,
    enableDataQuery = true,
    colorPalette?: string[],
    animationDuration?: number
  ): Promise<ChartGenerationOutput> {
    const modelType = this.getModelType();
    let finalDataset = dataset;
    let finalFieldInfo = fieldInfo;
    let queryDatasetUsage;
    try {
      if (enableDataQuery) {
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
      totalTime: animationDuration
    };

    const chartGenerationResult = await this.runApplication(ApplicationType.ChartGeneration, modelType, context);
    const { chartType, spec } = chartGenerationResult;
    const usage = calculateTokenUsage([queryDatasetUsage, chartGenerationResult.usage]);
    return {
      ...chartGenerationResult,
      spec,
      usage,
      time: estimateVideoTime(chartType, spec, animationDuration ? animationDuration * 1000 : undefined)
    };
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
