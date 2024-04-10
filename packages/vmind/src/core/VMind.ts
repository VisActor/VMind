import { _chatToVideoWasm } from '../chart-to-video';
import { ILLMOptions, TimeType, Model, SimpleFieldInfo, DataItem, OuterPackages, ModelType } from '../typings';
import { getFieldInfoFromDataset, parseCSVData as parseCSVDataWithRule } from '../common/dataProcess';
import { generateChartWithAdvisor } from '../common/chartAdvisor';
import applicationMetaList, { ApplicationType } from './applications';
import { VMindApplicationMap } from './types';
import { BaseApplication } from 'src/base/application';

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
  ) {
    if (this.getModelType() === ModelType.GPT) {
      const context = {
        userInput: userPrompt,
        fieldInfo,
        dataset,
        llmOptions: this._options
      };
      const application = this.getApplication(ApplicationType.DataAggregation, ModelType.GPT);
      return application.runTasks(context);
    }
    if (this.getModelType() === ModelType.SKYLARK) {
      //return queryDatasetWithSkylark(userPrompt, fieldInfo, dataset, this._options);
    }
    console.error('unsupported model in data query!');

    return { fieldInfo: [], dataset } as any;
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
