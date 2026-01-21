import {
  DimensionDataset,
  MeasureDataset,
  ChartType,
  ScreenSize,
  UserPurpose,
  AdviseResult,
  AdviserParams,
  DataTypeName,
  MeasureField,
  DimensionField,
  OldScorer,
  ChartData,
  OldScoreResult
} from './types';

import * as dataUtils from './dataUtil';
import { isNil } from '@visactor/vutils';
import { isNaN } from './dataUtil';
import { createBarScorer } from './scorers/bar';
import { createLineScorer } from './scorers/line';
import { createPieScorer } from './scorers/pie';
import { defaultConfig } from './rules/config';

export { fold, omit } from './fieldUtils';
export { FOLD_NAME, FOLD_VALUE, COLOR_FIELD, FOLD_VALUE_MAIN, FOLD_VALUE_SUB, GROUP_FIELD } from './constant';

function convertToChartData(params: any, chartType: string): ChartData {
  const { inputDataSet, dimList, measureList, aliasMap = {} } = params;

  const dimensions = dimList.map((d: any) => aliasMap[d.uniqueID] ?? d.uniqueID);
  const metrics = measureList.map((m: any) => aliasMap[m.uniqueID] ?? m.uniqueID);

  const data = inputDataSet.map((row: any) => {
    const newRow: Record<string, any> = {};
    for (const id in row) {
      const name = aliasMap[id] ?? id;
      newRow[name] = row[id];
    }
    return newRow;
  });

  return {
    data,
    dimensions,
    metrics,
    chartType
  };
}

const scorerAdapter: OldScorer = params => {
  const { purpose } = params;

  const calBar = (): OldScoreResult => {
    const chartData = convertToChartData(params, 'bar');
    const scoreResult = createBarScorer(defaultConfig)(chartData, defaultConfig);
    return {
      chartType: ChartType.BAR,
      score: scoreResult.score,
      originScore: scoreResult.score,
      fullMark: 1, // Simplified fullMark
      scoreDetails: scoreResult.details as any // To be compatible with OldScoreResult
    };
  };

  const calLine = (): OldScoreResult => {
    const chartData = convertToChartData(params, 'line');
    const scoreResult = createLineScorer(defaultConfig)(chartData, defaultConfig);
    return {
      chartType: ChartType.LINE,
      score: scoreResult.score,
      originScore: scoreResult.score,
      fullMark: 1,
      scoreDetails: scoreResult.details as any
    };
  };

  const calPie = (): OldScoreResult => {
    const chartData = convertToChartData(params, 'pie');
    const scoreResult = createPieScorer(defaultConfig)(chartData, defaultConfig);
    return {
      chartType: ChartType.PIE,
      score: scoreResult.score,
      originScore: scoreResult.score,
      fullMark: 1,
      scoreDetails: scoreResult.details as any
    };
  };

  // More chart type calculators can be added here following the same pattern.

  const scoreCalculators: (() => OldScoreResult)[] = [calBar, calLine, calPie];

  return scoreCalculators;
};

export function chartAdvisor(params: AdviserParams): AdviseResult {
  const {
    originDataset,
    dimensionList,
    measureList,
    aliasMap = {},
    maxPivotRow = 0,
    maxPivotColumn = 0,
    purpose = UserPurpose.NONE,
    screen = ScreenSize.LARGE,
    scorer = scorerAdapter
  } = params;

  const measureDatasets: MeasureDataset[] = [];

  /*
  计算measure的统计特征。
  由于服务端返回的vizData.dataset做了平坦化(fold)处理，且remain=false，
  因此当多度量时需要先判断dataset中是否有该uniqueID对应的值.
  */
  measureList.forEach(measure => {
    const uniqueID = measure.uniqueId;
    const measureSet: MeasureDataset = {
      data: []
    };
    measureSet.uniqueID = uniqueID;
    originDataset.forEach(row => {
      if (row.hasOwnProperty(uniqueID)) {
        measureSet.data.push(parseFloat(row[uniqueID]));
      }
    });
    const dataNotNull = measureSet.data.filter(each => !isNil(each) && !isNaN(Number(each)));
    measureSet.min = Math.min(...dataNotNull);
    measureSet.max = Math.max(...dataNotNull);
    measureSet.mean = dataUtils.calMean(measureSet);
    measureSet.standardDev = dataUtils.calStandardDeviation(measureSet);
    measureSet.coefficient = dataUtils.calCoefficient(measureSet);
    measureSet.Q1 = dataUtils.calQuantile(measureSet, 0.25);

    measureDatasets.push(measureSet);
  });

  const dimensionDatasets: DimensionDataset[] = [];

  /*
  计算dimension的字段特征（字段名、基数、基数/数据条数）。
  */
  dimensionList.forEach(dimension => {
    const uniqueID = dimension.uniqueId;
    const dimensionSet: DimensionDataset = {
      data: []
    };
    dimensionSet.uniqueID = uniqueID;
    originDataset.forEach(row => {
      dimensionSet.data.push(row[uniqueID]);
    });
    dimensionSet.dataType = dimension.type;
    dimensionSet.dimensionName = aliasMap[uniqueID];
    dimensionSet.cardinal = dataUtils.unique(dimensionSet.data).length;
    dimensionSet.ratio = dimensionSet.cardinal / dimensionSet.data.length;
    dimensionSet.isGeoField = !!dimension.isGeoField;
    dimensionDatasets.push(dimensionSet);
  });

  try {
    const scores = scorer({
      inputDataSet: originDataset,
      dimList: dimensionDatasets,
      measureList: measureDatasets,
      aliasMap,
      maxRowNum: maxPivotRow,
      maxColNum: maxPivotColumn,
      purpose,
      screen
    }).map(calculator => {
      const score = calculator();
      return score;
    });

    if (scores.length === 0) {
      return {
        chartType: ChartType.TABLE,
        scores: []
      };
    }

    scores.sort((chart1, chart2) => chart2.score - chart1.score);

    if (scores[0].score === 0) {
      return {
        chartType: ChartType.TABLE,
        scores: []
      };
    }

    return {
      chartType: scores[0].chartType,
      scores
    };
  } catch (exception: any) {
    return {
      chartType: ChartType.TABLE,
      scores: [],
      error: exception.message ?? exception
    };
  }
}

export {
  OldScorer as Scorer,
  AdviserParams,
  AdviseResult,
  ChartType,
  DataTypeName,
  MeasureField,
  DimensionField,
  dataUtils
};
