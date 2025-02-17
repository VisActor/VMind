import type { TimeType, OuterPackages, VMindDataset, ChartTheme } from '../common/typings';
import { LLMManage } from './llm';
import type {
  BasemapOption,
  ChartGeneratorCtx,
  ChartType,
  ClusterDataView,
  DataItem,
  DataTable,
  FieldInfo,
  ILLMOptions,
  Usage
} from '../types';
import { AtomName } from '../types';
import {
  getData2ChartSchedule,
  getDataQuerySchedule,
  getText2DataSchedule,
  getDataInsightSchedule,
  getText2ChartSchedule
} from '../applications';
import type { Schedule } from '../schedule';
import { getFieldInfoFromDataset } from '../utils/field';
import { parseCSVData } from '../utils/dataTable';
import { fillSpecTemplateWithData } from '../utils/spec';
import { _chatToVideoWasm } from '../utils/video';
import type { DataInsightOptions } from 'src/atom';

class VMind {
  private _FPS = 30;
  private llm: LLMManage;
  private dataQuerySchedule: Schedule<[AtomName.DATA_QUERY]>;
  private text2DataTableSchedule: Schedule<[AtomName.DATA_EXTRACT, AtomName.DATA_CLEAN]>;
  private text2ChartSchedule: Schedule<
    [AtomName.DATA_EXTRACT, AtomName.DATA_CLEAN, AtomName.CHART_COMMAND, AtomName.CHART_GENERATE]
  >;
  private dataInsightSchedule: Schedule<[AtomName.DATA_INSIGHT]>;
  private data2ChartSchedule:
    | Schedule<[AtomName.DATA_QUERY, AtomName.CHART_GENERATE]>
    | Schedule<[AtomName.CHART_GENERATE]>;

  constructor(options?: ILLMOptions) {
    this.llm = new LLMManage(options);
    this.data2ChartSchedule = getData2ChartSchedule(this.llm, options);
    this.dataQuerySchedule = getDataQuerySchedule(this.llm, options);
    this.text2DataTableSchedule = getText2DataSchedule(this.llm, options);
    this.text2ChartSchedule = getText2ChartSchedule(this.llm, options);
    this.dataInsightSchedule = getDataInsightSchedule(this.llm, options);
  }

  updateOptions(options?: ILLMOptions) {
    this.llm.updateOptions(options);
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

  /**
   *
   * @param userPrompt user's query
   * @param dataset current Data set
   * @param fieldInfo field infomation of dataset
   * @returns new FieldInfo && new DataSet after user's query
   */
  async dataQuery(
    userPrompt: string, //user's intent of visualization, usually aspect in data that they want to visualize
    dataset: DataTable,
    fieldInfo?: FieldInfo[]
  ) {
    this.dataQuerySchedule.setNewTask({
      command: userPrompt,
      fieldInfo,
      dataTable: dataset
    });
    const { dataTable, fieldInfo: newFieldInfo, usage } = await this.dataQuerySchedule.run();
    return {
      dataTable,
      fieldInfo: newFieldInfo,
      usage
    };
  }

  /**
   * Extract json format data from the text
   */
  async text2Data(
    text: string,
    userPrompt?: string,
    options?: {
      fieldInfo?: FieldInfo[];
      hierarchicalClustering?: boolean;
      clusterThreshold?: number;
    }
  ): Promise<{
    extractDataTable: DataTable;
    dataTable: DataTable;
    fieldInfo: FieldInfo[];
    extractFieldInfo: FieldInfo[];
    usage: Usage;
    clusterResult: ClusterDataView[];
  }> {
    const { fieldInfo, hierarchicalClustering, clusterThreshold } = options || {};
    this.text2DataTableSchedule.setNewTask({
      text,
      fieldInfo: fieldInfo?.length ? fieldInfo : []
    });
    this.text2DataTableSchedule.updateOptions({
      dataClean: {
        hierarchicalClustering,
        clusterThreshold
      }
    });
    const {
      dataTable,
      fieldInfo: newFieldInfo,
      usage,
      clusterResult
    } = await this.text2DataTableSchedule.run(userPrompt);
    const { fieldInfo: extractFieldInfo, dataTable: extractDataTable } = this.text2DataTableSchedule.getContext(
      AtomName.DATA_EXTRACT
    );
    return {
      extractDataTable,
      extractFieldInfo,
      dataTable,
      fieldInfo: newFieldInfo,
      usage,
      clusterResult
    };
  }

  async text2Chart(
    text: string,
    userPrompt?: string,
    options?: {
      fieldInfo?: FieldInfo[];
      chartTypeList?: ChartType[];
      colorPalette?: string[];
      animationDuration?: number;
      theme?: ChartTheme | string;
      basemapOption?: BasemapOption;
    }
  ) {
    const { fieldInfo, ...chartOptions } = options || {};
    this.text2ChartSchedule.setNewTask({
      text,
      fieldInfo: fieldInfo?.length ? fieldInfo : [],
      command: userPrompt
    });
    const shouldRunList: Record<string, boolean> = {
      [AtomName.CHART_COMMAND]: !userPrompt
    };
    this.text2ChartSchedule.updateOptions({
      chartGenerate: {
        ...chartOptions
      }
    });
    const {
      chartAdvistorRes,
      spec,
      command,
      cell,
      vizSchema,
      dataTable,
      time,
      fieldInfo: newFieldInfo,
      usage
    } = await this.text2ChartSchedule.run(userPrompt, shouldRunList);
    return {
      spec,
      command,
      chartAdvistorRes,
      cell,
      vizSchema,
      time,
      dataTable,
      fieldInfo: newFieldInfo,
      usage
    };
  }

  /**
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
    this.data2ChartSchedule.setNewTask({
      fieldInfo,
      dataTable: dataset,
      command: userPrompt || ''
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

  async getInsights(spec: any, options?: DataInsightOptions) {
    this.dataInsightSchedule.setNewTask({
      spec
    });
    this.dataInsightSchedule.updateOptions({
      dataInsight: options || {}
    });
    const { insights, usage } = await this.dataInsightSchedule.run();
    return { insights, usage };
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
