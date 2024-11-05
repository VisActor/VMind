/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DatasetFromText, MultipleDataCleanCtx } from '../../types/atom';
import { AtomName } from '../../types/atom';
import type { MultipleDataCleanOptions } from '../type';
import { BaseAtom } from '../base';
import { isArray, merge } from '@visactor/vutils';
import {
  canMergeClusterResult,
  canMergeDataTable,
  getSplitDataViewOfDataTable,
  mergeClusterDataView,
  mergeDataTable
} from './utils';
import { pipelines } from './dataClean';

export class MultipleDataCleanAtom extends BaseAtom<MultipleDataCleanCtx, MultipleDataCleanOptions> {
  name = AtomName.MULTIPLE_DATA_CLEAN;

  constructor(context: MultipleDataCleanCtx, option: MultipleDataCleanOptions) {
    super(context, option);
  }

  buildDefaultContext(context: MultipleDataCleanCtx): MultipleDataCleanCtx {
    return merge(
      {},
      {
        datasets: []
      },
      context
    );
  }

  buildDefaultOptions(): MultipleDataCleanOptions {
    return {
      filterSameValueColumn: true,
      needNumericalFields: true,
      measureAutoTransfer: true,
      filterSameDataItem: true,
      filterRowWithEmptyValues: true,
      rangeValueTransfer: 'last',
      hierarchicalClustering: true,
      clusterThreshold: 0.4,
      filterRatioInDataset: 0.6
    };
  }

  shouldRunByContextUpdate(context: MultipleDataCleanCtx): boolean {
    return context.datasets !== this.context.datasets;
  }

  _runWithOutLLM(): MultipleDataCleanCtx {
    const { datasets } = this.context;
    const { filterRatioInDataset } = this.options;
    const result: DatasetFromText[] = [];
    datasets.forEach(dataset => {
      let newDataset: any = { ...dataset };
      pipelines.forEach(({ key, func }) => {
        const isMeasureAutoTransfer = key === 'measureAutoTransfer';
        const currentOption = isMeasureAutoTransfer ? dataset?.text : (this.options as any)[key];
        if (currentOption !== false) {
          newDataset = {
            ...newDataset,
            ...func(newDataset, currentOption)
          };
        }
      });
      if (this.options.hierarchicalClustering) {
        const { clusterResult = [] } = getSplitDataViewOfDataTable(newDataset, this.options.clusterThreshold);
        if (false && canMergeClusterResult(clusterResult)) {
          /** todo */
          newDataset = {
            ...newDataset,
            ...mergeClusterDataView(clusterResult)
          };
        } else if (clusterResult.length) {
          const maxValidCount = clusterResult[0].validCellCount;
          newDataset = clusterResult
            .filter(dataView => {
              const { validCellCount, validMeasureCellCount, validColumnLength, validRowLength } = dataView;
              return (
                validCellCount / maxValidCount >= filterRatioInDataset ||
                validMeasureCellCount === validColumnLength * validRowLength
              );
            })
            .map(dataView => ({
              ...newDataset,
              dataTable: dataView.dataTable,
              fieldInfo: dataView.fieldInfo
            }));
        }
      }
      if (isArray(newDataset) && newDataset.length === 1) {
        newDataset = newDataset[0];
      }
      if (isArray(newDataset)) {
        result.push(...newDataset);
      }
      // else if (canMergeDataTable(result[result.length - 1], newDataset)) {
      //   result[result.length - 1] = mergeDataTable(result[result.length - 1], newDataset);
      // }
      else if (newDataset.dataTable?.length > 0) {
        result.push(newDataset);
      }
    });
    this.updateContext({
      datasets: result
    });
    return this.context;
  }
}
