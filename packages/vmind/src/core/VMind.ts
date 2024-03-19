import { _chatToVideoWasm } from '../chart-to-video';
import { generateChartWithGPT } from '../gpt/chart-generation/NLToChart';
import { ILLMOptions, TimeType, Model, SimpleFieldInfo, DataItem, OuterPackages, ModelType } from '../typings';
import { parseCSVDataWithGPT } from '../gpt/dataProcess';
import { getFieldInfoFromDataset, parseCSVData as parseCSVDataWithRule } from '../common/dataProcess';
import { generateChartWithSkylark } from '../skylark/chart-generation';
import { queryDatasetWithGPT } from '../gpt/dataProcess/query/queryDataset';
import { generateChartWithAdvisor } from '../common/chartAdvisor';
import { queryDatasetWithSkylark } from '../skylark/dataProcess/query/queryDataset';

class VMind {
  private _FPS = 30;
  private _options: ILLMOptions | undefined;
  private _model: Model | string;

  constructor(options?: ILLMOptions) {
    this._options = { ...(options ?? {}) };
    this._model = options.model ?? Model.GPT3_5;
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
   * call LLM to parse csv data. return fieldInfo and raw dataset.
   * fieldInfo includes name, type, role, description of each field.
   * NOTE: This will transfer your data to LLM.
   * @param csvString csv data user want to visualize
   * @param userPrompt
   * @returns
   */
  parseCSVDataWithLLM(csvString: string, userPrompt: string) {
    if (this.getModelType() === ModelType.GPT) {
      return parseCSVDataWithGPT(csvString, userPrompt, this._options);
    }
    console.error('Unsupported Model!');

    return undefined;
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

  /**
   *
   * @param userPrompt user's visualization intention (what aspect they want to show in the data)
   * @param fieldInfo information about fields in the dataset. field name, type, etc. You can get fieldInfo using parseCSVData or parseCSVDataWithLLM
   * @param dataset raw dataset used in the chart
   * @param colorPalette color palette of the chart
   * @param animationDuration duration of chart animation.
   * @returns spec and time duration of the chart.
   */
  async generateChart(
    userPrompt: string, //user's intent of visualization, usually aspect in data that they want to visualize
    fieldInfo: SimpleFieldInfo[],
    dataset: DataItem[],
    enableDataQuery = true,
    colorPalette?: string[],
    animationDuration?: number
  ) {
    if (this.getModelType() === ModelType.GPT) {
      return generateChartWithGPT(
        userPrompt,
        fieldInfo,
        dataset,
        this._options,
        enableDataQuery,
        colorPalette,
        animationDuration
      );
    }
    if (this.getModelType() === ModelType.SKYLARK) {
      return generateChartWithSkylark(userPrompt, fieldInfo, dataset, this._options, colorPalette, animationDuration);
    }

    return generateChartWithAdvisor(fieldInfo, dataset, colorPalette, animationDuration);
  }

  async dataQuery(
    userPrompt: string, //user's intent of visualization, usually aspect in data that they want to visualize
    fieldInfo: SimpleFieldInfo[],
    dataset: DataItem[]
  ) {
    if (this.getModelType() === ModelType.GPT) {
      return queryDatasetWithGPT(userPrompt, fieldInfo, dataset, this._options);
    }
    if (this.getModelType() === ModelType.SKYLARK) {
      return queryDatasetWithSkylark(userPrompt, fieldInfo, dataset, this._options);
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
