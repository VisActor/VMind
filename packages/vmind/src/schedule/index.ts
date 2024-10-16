/* eslint-disable @typescript-eslint/no-explicit-any */
import { merge } from '@visactor/vutils';
import type { BaseContext } from '../types/atom';
import { AtomName } from '../types/atom';
import { BaseAtom } from '../atom/base';
import { DataQueryAtom, DataExtractionAtom, ChartGeneratorAtom, ChartCommandAtom, DataInsightAtom } from '../atom';
import type { CombineAll, MapAtomTypes, TaskMapping } from '../types/schedule';
import { DataCleanAtom } from '../atom/dataClean';
import type {
  BaseOptions,
  ChartCommandOptions,
  DataCleanOptions,
  DataExtractionOptions,
  DataInsightOptions
} from '../atom/type';

export interface ScheduleOptions {
  [AtomName.BASE]?: BaseOptions;
  [AtomName.DATA_EXTRACT]?: DataExtractionOptions;
  [AtomName.DATA_CLEAN]?: DataCleanOptions;
  [AtomName.DATA_QUERY]?: BaseOptions;
  [AtomName.DATA_INSIGHT]?: DataInsightOptions;
  [AtomName.CHART_GENERATE]?: BaseOptions;
  [AtomName.CHART_COMMAND]?: ChartCommandOptions;
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

  constructor(atomList: T, options: ScheduleOptions, context?: CombineAll<MapAtomTypes<T>>) {
    this.atomList = atomList;
    this.options = options;
    this.query = '';
    this.atomInstaces = atomList.map(atomName => this.atomFactory(atomName));
    this.setNewTask(context);
  }

  initContext() {
    this.context = {} as T;
    this.atomInstaces.forEach(atom => {
      this.context = atom.buildDefaultContext(this.context);
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
      case AtomName.DATA_QUERY:
        return new DataQueryAtom(this.context, options);
      case AtomName.DATA_INSIGHT:
        return new DataInsightAtom(this.context, options);
      case AtomName.CHART_COMMAND:
        return new ChartCommandAtom(this.context, options);
      case AtomName.CHART_GENERATE:
        return new ChartGeneratorAtom(this.context, options);
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

  async run(query?: string): Promise<Awaited<CombineAll<MapAtomTypes<T>>>> {
    this.query = query;
    const subTasks = this.parseSubTasks(query);
    for (const atom of this.atomInstaces) {
      const { shouldRun, query: taskQuery } = subTasks?.[atom.name] || {};
      if (shouldRun || atom.shouldRunByContextUpdate(this.context)) {
        this.context = await atom.run({ context: this.context, query: taskQuery });
      }
    }
    return this.context;
  }

  /** init new task ready to run new query */
  setNewTask(context: any) {
    this.initContext();
    this.updateContext(context);
    this.atomInstaces.forEach(atom => {
      atom.reset(this.context);
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
