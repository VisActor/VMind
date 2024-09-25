import type { DataCleanCtx } from '../../types/atom';
import { AtomName, type DataExtractionCtx } from '../../types/atom';
import type { DataCleanOptions } from '../type';
import { BaseAtom } from '../base';
import { merge } from '@visactor/vutils';
import {
  getCtxByfilterSameValueColumn,
  getCtxByneedNumericalFields,
  getCtxBymeasureAutoTransfer,
  getCtxByfilterSameDataItem,
  getCtxByFilterRowWithNonEmptyValues,
  getCtxByRangeValueTranser
} from './utils';

/** The order of pipeline is meaningful   */
const pipelines = [
  {
    key: 'rangeValueTransfer',
    func: getCtxByRangeValueTranser
  },
  {
    key: 'filterRowWithEmptyValues',
    func: getCtxByFilterRowWithNonEmptyValues
  },
  {
    key: 'filterSameValueColumn',
    func: getCtxByfilterSameValueColumn
  },
  {
    key: 'measureAutoTransfer',
    func: getCtxBymeasureAutoTransfer
  },
  {
    key: 'filterSameDataItem',
    func: getCtxByfilterSameDataItem
  },
  {
    key: 'needNumericalFields',
    func: getCtxByneedNumericalFields
  }
];

export class DataCleanAtom extends BaseAtom<DataCleanCtx, DataCleanOptions> {
  name = AtomName.DATA_CLEAN;

  constructor(context: DataExtractionCtx, option: DataCleanOptions) {
    super(context, option);
  }

  buildDefaultContext(context: DataExtractionCtx): DataExtractionCtx {
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
      rangeValueTransfer: 'avg'
    };
  }

  shouldRunByContextUpdate(context: DataCleanCtx): boolean {
    return context.dataTable !== this.context.dataTable;
  }

  _runWithOutLLM(): DataCleanCtx {
    let newContext = { ...this.context };
    pipelines.forEach(({ key, func }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((this.options as any)[key]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newContext = func(newContext, (this.options as any)[key]);
      }
    });
    this.setNewContext(newContext);
    return this.context;
  }
}
