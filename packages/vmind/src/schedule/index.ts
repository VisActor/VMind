/* eslint-disable @typescript-eslint/no-explicit-any */
import { merge } from '@visactor/vutils';
import type { BaseContext, Usage } from '../types/atom';
import { AtomName } from '../types/atom';
import { BaseAtom } from '../atom/base';
import {
  DataQueryAtom,
  DataExtractionAtom,
  ChartGeneratorAtom,
  ChartCommandAtom,
  DataInsightAtom,
  MultipleDataCleanAtom,
  MultipleChartCommandAtom,
  CustomPrompt,
  ChartQAExtraction
} from '../atom';
import type { CombineAll, MapAtomTypes, TaskMapping } from '../types/schedule';
import { DataCleanAtom } from '../atom/dataClean/dataClean';
import type {
  BaseOptions,
  ChartCommandOptions,
  ChartGeneratorOptions,
  DataCleanOptions,
  DataExtractionOptions,
  DataInsightOptions,
  CustomPromptOptions
} from '../atom/type';

export interface ScheduleOptions {
  [AtomName.BASE]?: BaseOptions;
  [AtomName.DATA_EXTRACT]?: DataExtractionOptions;
  [AtomName.DATA_CLEAN]?: DataCleanOptions;
  [AtomName.MULTIPLE_DATA_CLEAN]?: DataCleanOptions;
  [AtomName.DATA_QUERY]?: BaseOptions;
  [AtomName.DATA_INSIGHT]?: DataInsightOptions;
  [AtomName.CHART_GENERATE]?: ChartGeneratorOptions;
  [AtomName.CHART_COMMAND]?: ChartCommandOptions;
  [AtomName.MULTIPLE_CHART_COMMAND]?: ChartCommandOptions;
  [AtomName.CHART_QA_EXTRACTION]?: BaseOptions;
  [AtomName.CUSTOM_PROMPT]?: CustomPromptOptions;
}

export class Schedule<T extends AtomName[]> {
  atomInstaces: (
    | DataExtractionAtom
    | DataCleanAtom
    | DataQueryAtom
    | ChartGeneratorAtom
    | BaseAtom<BaseContext, BaseOptions>
  )[];

  atomList: AtomName[];

  private context: any;

  options: ScheduleOptions;

  /** current query */
  protected query: string;

  /** @todo */
  historySteps: any;

  constructor(atomList: T, options?: ScheduleOptions, context?: CombineAll<MapAtomTypes<T>>) {
    this.atomList = atomList;
    this.options = options || {};
    this.query = '';
    this.atomInstaces = atomList.map(atomName => this.atomFactory(atomName));
    this.setNewTask(context);
  }

  initContext() {
    this.context = {} as T;
    this.atomInstaces.forEach(atom => {
      this.context = atom.buildDefaultContext(this.context);
      atom.reset();
    });
  }

  getAtomOptions(atomName: AtomName) {
    return merge({}, this.options[AtomName.BASE], this.options[atomName]);
  }

  atomFactory(atomName: AtomName) {
    const options = this.getAtomOptions(atomName);
    switch (atomName) {
      case AtomName.DATA_EXTRACT:
        return new DataExtractionAtom(this.context, options);
      case AtomName.DATA_CLEAN:
        return new DataCleanAtom(this.context, options);
      case AtomName.MULTIPLE_DATA_CLEAN:
        return new MultipleDataCleanAtom(this.context, options);
      case AtomName.DATA_QUERY:
        return new DataQueryAtom(this.context, options);
      case AtomName.DATA_INSIGHT:
        return new DataInsightAtom(this.context, options);
      case AtomName.CHART_COMMAND:
        return new ChartCommandAtom(this.context, options);
      case AtomName.MULTIPLE_CHART_COMMAND:
        return new MultipleChartCommandAtom(this.context, options);
      case AtomName.CHART_GENERATE:
        return new ChartGeneratorAtom(this.context, options);
      case AtomName.CHART_QA_EXTRACTION:
        return new ChartQAExtraction(this.context, options);
      case AtomName.CUSTOM_PROMPT:
        return new CustomPrompt(this.context, options);
      default:
        return new BaseAtom(this.context, options);
    }
  }

  /** regonize user intention and parse as sub tasks to atom instances */
  private parseSubTasks(query?: string): TaskMapping {
    /** @todo */
    let taskMapping: TaskMapping = {};
    this.atomList.forEach(name => {
      taskMapping = {
        ...taskMapping,
        [name]: {
          shouldRun: true,
          query
        }
      };
    });
    return taskMapping;
  }

  private addUsage(oldUsage: Usage, newUsage: Usage): Usage {
    const result: Usage = {} as Usage;

    for (const key in oldUsage) {
      if (Object.prototype.hasOwnProperty.call(oldUsage, key)) {
        const curKey = key as keyof Usage;
        result[curKey] = (oldUsage[curKey] || 0) + (newUsage[curKey] || 0);
      }
    }

    return result;
  }

  async run(query?: string, shouldRunList?: Record<AtomName, boolean>): Promise<Awaited<CombineAll<MapAtomTypes<T>>>> {
    this.query = query;
    const subTasks = this.parseSubTasks(query);
    let usage: Usage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    };
    for (const atom of this.atomInstaces) {
      const { shouldRun, query: taskQuery } = subTasks?.[atom.name] || {};
      if (shouldRunList?.[atom.name] !== false && (shouldRun || atom.shouldRunByContextUpdate(this.context))) {
        this.context = await atom.run({ context: this.context, query: taskQuery });
        usage = this.addUsage(usage, atom.getContext()?.usage);
      }
    }
    this.context = {
      ...this.context,
      usage: usage
    };
    return this.context;
  }

  /** init new task ready to run new query */
  setNewTask(context: any) {
    this.initContext();
    this.updateContext(context);
    this.atomInstaces.forEach(atom => {
      atom.reset(this.context);
      atom.clearHistory();
    });
  }

  updateOptions(options: ScheduleOptions) {
    this.options = merge({}, this.options, options);
    this.atomInstaces.forEach(atom => atom.updateOptions(this.getAtomOptions(atom.name)));
  }

  updateContext(context: any, isReplace = false) {
    this.context = isReplace ? context : merge({}, this.context, context);
  }

  /**
   * get schedule context or specific context of atom
   * @param atomName name of atom(optional)
   * @returns context
   */
  getContext(atomName?: AtomName): CombineAll<MapAtomTypes<T>> {
    if (atomName) {
      const atomInstaces = this.atomInstaces.find(atom => atom.name === atomName);
      if (!atomInstaces) {
        console.error(`Doesn\'t exist ${atomName}`);
        return null;
      }
      return atomInstaces.getContext() as any;
    }
    return this.context;
  }
}
