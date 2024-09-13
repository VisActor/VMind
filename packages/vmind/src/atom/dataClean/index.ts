import type { DataCleanCtx } from '../../types/atom';
import { AtomName, type DataExtractionCtx } from '../../types/atom';
import type { DataCleanOptions } from '../type';
import { BaseAtom } from '../base';
import { merge, pick } from '@visactor/vutils';

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
      needNumericalFields: true
    };
  }

  shouldRunByContextUpdate(context: DataCleanCtx): boolean {
    return context.dataTable !== this.context.dataTable;
  }

  _runWithOutLLM(): DataCleanCtx {
    const { filterSameValueColumn, needNumericalFields } = this.options;
    // @attention the value of context maybe not new after some clean task
    const { fieldInfo = [], dataTable = [] } = this.context || {};
    let newContext = { ...this.context };
    if (filterSameValueColumn && dataTable.length > 1 && fieldInfo.length) {
      const cleanFieldKey: string[] = [];
      fieldInfo.forEach(info => {
        if (info.fieldType === 'numerical') {
          return;
        }
        let shouldFilter = true;
        const prev = dataTable[0][info.fieldName];
        for (let i = 1; i < dataTable.length; i++) {
          if (dataTable[i][info.fieldName] !== prev) {
            shouldFilter = false;
            break;
          }
        }
        shouldFilter && cleanFieldKey.push(info.fieldName);
      });
      if (cleanFieldKey.length) {
        newContext.fieldInfo = fieldInfo.filter(info => !cleanFieldKey.includes(info.fieldName));
        const fieldNameList = newContext.fieldInfo.map(info => info.fieldName);
        newContext.dataTable = dataTable.map(dataItem => pick(dataItem, fieldNameList));
      }
    }
    if (needNumericalFields && newContext.fieldInfo.findIndex(info => info?.fieldType === 'numerical') === -1) {
      newContext = {
        dataTable: [],
        fieldInfo: []
      };
    }
    this.setNewContext(newContext);
    return this.context;
  }
}
