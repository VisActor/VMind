/* eslint-disable @typescript-eslint/no-explicit-any */
import { merge } from '@visactor/vutils';
import type { BaseContext, Usage, IBaseAtom, BaseOptions } from '../types/atom';
import { AtomName } from '../types/atom';
import type { CombineAll, MapAtomTypes, ScheduleOptions, TaskMapping } from '../types/schedule';
import { Factory } from '../core/factory';

export class Schedule<T extends AtomName[]> {
  atomInstances: IBaseAtom<BaseContext, BaseOptions>[];

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
    this.atomInstances = atomList.map(atomName => this.atomFactory(atomName));
    this.setNewTask(context);
  }

  initContext() {
    this.context = {} as T;
    this.atomInstances.forEach(atom => {
      this.context = atom.buildDefaultContext(this.context);
      atom.reset();
    });
  }

  getAtomOptions(atomName: AtomName) {
    return merge({}, this.options[AtomName.BASE], (this.options as any)[atomName]);
  }

  atomFactory(atomName: AtomName) {
    const options = this.getAtomOptions(atomName);

    return Factory.createAtom(atomName, this.context, options);
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

  private addUsage(oldUsage: Usage, newUsage?: Usage): Usage {
    const result: Usage = {} as Usage;
    if (!newUsage) {
      return oldUsage;
    }
    for (const key in oldUsage) {
      if (Object.prototype.hasOwnProperty.call(oldUsage, key)) {
        const curKey = key as keyof Usage;
        result[curKey] = (oldUsage[curKey] || 0) + (newUsage?.[curKey] || 0);
      }
    }

    return result;
  }

  async run(query?: string, shouldRunList?: Record<AtomName, boolean>): Promise<Awaited<CombineAll<MapAtomTypes<T>>>> {
    this.query = query || '';
    const subTasks = this.parseSubTasks(query);
    let usage: Usage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    };
    for (const atom of this.atomInstances) {
      const { shouldRun, query: taskQuery } = (subTasks as any)?.[atom.name] || {};
      if ((shouldRunList as any)?.[atom.name] !== false && (shouldRun || atom.shouldRunByContextUpdate(this.context))) {
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
    this.atomInstances.forEach(atom => {
      atom.reset(this.context);
      atom.clearHistory();
    });
  }

  updateOptions(options: ScheduleOptions) {
    this.options = merge({}, this.options, options);
    this.atomInstances.forEach(atom => atom.updateOptions(this.getAtomOptions(atom.name as AtomName)));
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
      const atomInstances = this.atomInstances.find(atom => atom.name === atomName);
      if (!atomInstances) {
        console.error(`Doesn\'t exist ${atomName}`);
        return null as any;
      }
      return atomInstances.getContext() as any;
    }
    return this.context;
  }
}
