import { DimensionDataset, MeasureDataset, ChartType, ScreenSize, UserPurpose } from './type';
import type {
  AdviseResult,
  Scorer,
  AdviserParams,
  ScoreResult,
  DataTypeName,
  MeasureField,
  DimensionField
} from './type';
import { scorer as defaultScorer } from './score';
import * as dataUtils from './dataUtil';
import { isNil, isNaN } from 'lodash';

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
    scorer = defaultScorer
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
    const dataNotNull = measureSet.data.filter(each => !isNil(each) && !isNaN(each));
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
      //后端版本可直接获取到未平坦化的dataSource，不用做此判断
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

    scores.sort((chart1, chart2) => chart2.score - chart1.score);
    // console.log(scores)
    if (scores[0].score === 0) {
      return {
        chartType: ChartType.TABLE,
        scores: []
      };
    }
    // console.log(scores)

    // scores.forEach(score => {
    //   let cell = score.cell
    //   if (!Array.isArray(cell)) {
    //     cell = [cell]
    //   }
    //   //将所有的key转换为string
    //   cell.forEach(cl => {
    //     Object.entries(cl).forEach(([k, v]) => {
    //       if (k === 'cartesianInfo' || k === 'foldInfo') {
    //         cl[k] = null
    //       }
    //       else {
    //         cl[k] = v.map(value => String(value))
    //       }
    //     })
    //   })

    //   score.cell = cell
    // })

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

export { Scorer, AdviserParams, ScoreResult, ChartType, AdviseResult, DataTypeName, MeasureField, DimensionField };
