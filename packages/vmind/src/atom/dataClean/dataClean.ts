import type { DataCleanCtx } from '../../types/atom';
import { AtomName } from '../../types/atom';
import type { DataCleanOptions } from '../type';
import { BaseAtom } from '../base';
import { merge } from '@visactor/vutils';
import {
  getCtxByfilterSameValueColumn,
  getCtxByneedNumericalFields,
  getCtxBymeasureAutoTransfer,
  getCtxByfilterSameDataItem,
  getCtxByFilterRowWithNonEmptyValues,
  getCtxByRangeValueTranser,
  getSplitDataViewOfDataTable,
  transferFieldInfo,
  revisedUnMatchedFieldInfo,
  sortDataTableByDate
} from './utils';

/** The order of pipeline is meaningful   */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pipelines: { key: string; func: (ctx: DataCleanCtx, ...args: any[]) => DataCleanCtx }[] = [
  /** revised unmatched problem */
  {
    key: 'revisedUnMatchedInfo',
    func: revisedUnMatchedFieldInfo
  },
  /** convert the interval data */
  {
    key: 'rangeValueTransfer',
    func: getCtxByRangeValueTranser
  },
  /** Correct the measurement fields. */
  {
    key: 'measureAutoTransfer',
    func: getCtxBymeasureAutoTransfer
  },
  /** Filter out the Row where all measurements are null. */
  {
    key: 'filterRowWithEmptyValues',
    func: getCtxByFilterRowWithNonEmptyValues
  },
  /** Filter out completely identical rows. */
  {
    key: 'filterSameDataItem',
    func: getCtxByfilterSameDataItem
  },
  /** Remove the fields where all dimension values are the same. */
  {
    key: 'filterSameValueColumn',
    func: getCtxByfilterSameValueColumn
  },
  /** Need at least one valid measure field */
  {
    key: 'needNumericalFields',
    func: getCtxByneedNumericalFields
  },
  {
    key: 'sortByDate',
    func: sortDataTableByDate
  }
];

export class DataCleanAtom extends BaseAtom<DataCleanCtx, DataCleanOptions> {
  name = AtomName.DATA_CLEAN;

  constructor(context: DataCleanCtx, option: DataCleanOptions) {
    super(context, option);
  }

  buildDefaultContext(context: DataCleanCtx): DataCleanCtx {
    return merge(
      {},
      {
        dataTable: [],
        fieldInfo: []
      },
      context
    );
  }

  buildDefaultOptions(): DataCleanOptions {
    return {
      filterSameValueColumn: true,
      needNumericalFields: true,
      measureAutoTransfer: true,
      filterSameDataItem: true,
      filterRowWithEmptyValues: true,
      rangeValueTransfer: 'avg',
      hierarchicalClustering: true
    };
  }

  updateContext(context: DataCleanCtx): DataCleanCtx {
    this.context = transferFieldInfo(super.updateContext(context));
    return this.context;
  }

  shouldRunByContextUpdate(context: DataCleanCtx): boolean {
    return context.dataTable !== this.context.dataTable;
  }

  _runWithOutLLM(): DataCleanCtx {
    let newContext = { ...this.context };
    pipelines.forEach(({ key, func }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentOption = (this.options as any)[key];
      if (currentOption !== false) {
        newContext = func(newContext, currentOption);
      }
    });
    this.setNewContext(newContext);
    if (this.options.hierarchicalClustering) {
      this.setNewContext(getSplitDataViewOfDataTable(newContext, this.options.clusterThreshold));
    }
    return this.context;
  }
}
