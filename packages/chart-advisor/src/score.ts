import { isTemporal } from './dataUtil';
import { cloneDeep } from '@visactor/vutils';
import {
  ChartType,
  MeasureDataset,
  ScreenSize,
  UserPurpose,
  AutoChartCell,
  Dataset,
  UniqueId,
  ScoreResult,
  Scorer
} from './type';
import * as dataUtils from './dataUtil';
import {
  assignMeasureCard,
  assignPieChart,
  assignPivotCharts,
  assignScatterPlot,
  assignFunnelChart,
  sortTimeDim,
  processCombination,
  assignDualAxis
} from './fieldAssign';
import { COLOR_FIELD, MAX_BAR_NUMBER, MIN_BAR_NUMBER, FOLD_NAME, FOLD_VALUE } from './constant';
import { getDomainFromDataset, fold } from './fieldUtils';
import { pivot, pivotCombination } from './pivot';

export const scorer: Scorer = params => {
  const {
    inputDataSet,
    dimList,
    measureList,
    aliasMap = {},
    maxRowNum = 0,
    maxColNum = 0,
    purpose = UserPurpose.NONE,
    screen = ScreenSize.LARGE
  } = params;

  const datasetWithoutFold = cloneDeep(inputDataSet);
  let originDataset = inputDataSet;

  //多度量可能没有扁平化
  if (measureList.length > 1 && !originDataset[0].hasOwnProperty(FOLD_NAME)) {
    originDataset = fold(
      originDataset,
      measureList.map(measure => measure.uniqueID),
      FOLD_NAME,
      FOLD_VALUE,
      aliasMap,
      false
    );
  }

  //找出时间字段和非时间字段
  const timeDim: UniqueId[] = [];
  const noneTimeDim: UniqueId[] = [];
  dimList.forEach(dim => {
    if (isTemporal(dim.dataType)) {
      timeDim.push(dim.uniqueID);
    } else {
      noneTimeDim.push(dim.uniqueID);
    }
  });

  //uniqueId到字段values的映射
  const uniqueIdMap = {};
  dimList.forEach(dim => {
    uniqueIdMap[dim.uniqueID] = dim;
  });

  measureList.forEach(measure => {
    uniqueIdMap[measure.uniqueID] = measure;
  });

  const dimensionID = dimList.map(dim => dim.uniqueID);
  const measureID = measureList.map(measure => measure.uniqueID);

  const pivotChartData = assignPivotCharts(originDataset, dimensionID, measureID, aliasMap, maxRowNum, maxColNum);

  const { dataset, colorItems, error, errMsg, aliasMap: newAliasMap } = pivotChartData;
  let { cell } = pivotChartData;

  const colList = error ? [] : cell.column;
  const rowList = error ? [] : cell.row;
  const emptyCell = {
    x: [],
    y: [],
    column: [],
    row: [],
    color: [],
    size: [],
    angle: []
  };
  // @todo:图例过多处理
  if (error) {
    cell = emptyCell;
  }

  // 透视分析
  const { datasets: pivotDataSet, colPivotTree, rowPivotTree } = pivot(dataset, colList, rowList, cell.y);

  const calBarParallel = (): ScoreResult => {
    if (!inputDataSet || inputDataSet.length === 0) {
      return {
        chartType: ChartType.COLUMN_PARALLEL,
        score: 0,
        fullMark: 0,
        originScore: 0,
        scoreDetails: [],
        error: 'Empty dataset'
      };
    }
    let score = 0;
    const scoreDetails: any = {};
    let totalScore = 0;

    if (error) {
      return {
        chartType: ChartType.COLUMN_PARALLEL,
        originScore: 0,
        score: 0,
        fullMark: 0,
        scoreDetails,
        error: error ? errMsg : null
      };
    }
    const measureLength = measureList.length;

    //维度数>0,指标数>0
    const rule1Score = 1.0;
    totalScore += rule1Score;
    if (cell.x.length > 0 && cell.y.length > 0) {
      score += rule1Score;
      scoreDetails.rule1 = rule1Score;
    } else {
      return {
        chartType: ChartType.COLUMN_PARALLEL,
        originScore: 0,
        score: 0,
        fullMark: 0,
        scoreDetails
      };
    }

    //指标最大值里面最大的/指标Q1(下四分位数)里面最小的<100（不同指标数值在同一个量级）
    const rule2Score = 3.0;
    totalScore += rule2Score;
    let maxMax = Math.max(...measureList.map(measure => Math.abs(measure.max)));
    let minQ1 = Math.min(...measureList.map(measure => Math.abs(measure.Q1)));
    if (maxMax === 0) {
      maxMax = 1;
    }
    if (minQ1 === 0) {
      minQ1 = 1;
    }

    if (maxMax / minQ1 < 100) {
      score += rule2Score;
      scoreDetails.rule2 = rule2Score;
    }

    //2<=图元数量<=30 (根据屏幕尺寸调整)
    const rule3Score = 4.0;
    totalScore += rule3Score;

    const colorSize = cell.color.length > 0 ? dataUtils.unique(dataset.map(data => data[COLOR_FIELD])).length : 1;
    const axisSize = dataUtils.unique(uniqueIdMap[cell.x[0]].data).length;

    const dataSize = colorSize * axisSize;

    if (dataSize <= MAX_BAR_NUMBER && dataSize >= MIN_BAR_NUMBER) {
      score += rule3Score;
      scoreDetails.rule4 = rule3Score;
    }

    return {
      chartType: ChartType.COLUMN_PARALLEL,
      score: score / totalScore,
      fullMark: totalScore,
      originScore: score,
      scoreDetails,
      cell,
      dataset
    };
  };

  const calBarPercent = (): ScoreResult => {
    if (!inputDataSet || inputDataSet.length === 0) {
      return {
        chartType: ChartType.COLUMN_PERCENT,
        score: 0,
        fullMark: 0,
        originScore: 0,
        scoreDetails: [],
        error: 'Empty dataset'
      };
    }
    let score = 0;
    let totalScore = 0;
    const scoreDetails: any = {};

    if (error) {
      return {
        chartType: ChartType.COLUMN_PERCENT,
        originScore: 0,
        fullMark: 0,
        score: 0,
        scoreDetails,
        error: error ? errMsg : null
      };
    }

    const dimensionLength = dimList.length - cell.row.length - cell.column.length;
    const measureLength = measureList.length;

    //维度数>1，指标数>0（不能是平行柱状图）
    const rule1Score = 1.0;
    totalScore += rule1Score;
    if (dimensionLength > 1 && measureLength > 0) {
      score += rule1Score;
      scoreDetails.rule1 = rule1Score;
    } else {
      return {
        chartType: ChartType.COLUMN_PERCENT,
        score: 0,
        fullMark: 0,
        originScore: 0,
        scoreDetails
      };
    }

    //指标最大值里面最大的/指标Q1(下四分位数)里面最小的<100（不同指标数值在同一个量级）
    const rule2Score = 3.0;
    totalScore += rule2Score;

    let maxMax = Math.max(...measureList.map(measure => Math.abs(measure.max)));
    let minQ1 = Math.min(...measureList.map(measure => Math.abs(measure.Q1)));
    if (maxMax === 0) {
      maxMax = 1;
    }
    if (minQ1 === 0) {
      minQ1 = 1;
    }

    if (maxMax / minQ1 < 100) {
      score += rule2Score;
      scoreDetails.rule2 = rule2Score;
    }

    //2<=图元数量<=30 (根据屏幕尺寸调整)
    const rule3Score = 1.0;
    totalScore += rule3Score;

    const axisSize = dataUtils.unique(uniqueIdMap[cell.x[0]].data).length;

    const dataSize = axisSize * measureLength;

    if (dataSize <= MAX_BAR_NUMBER && dataSize >= MIN_BAR_NUMBER) {
      score += rule3Score;
      scoreDetails.rule3 = rule3Score;
    }

    //图例数量<=150 (根据屏幕尺寸调整)
    const rule4Score = 1.0;
    totalScore += rule4Score;

    const colorSize = cell.color.length > 0 ? dataUtils.unique(dataset.map(data => data[COLOR_FIELD])).length : 1;

    if (colorSize <= MAX_BAR_NUMBER) {
      score += rule4Score;
      scoreDetails.rule4 = rule4Score;
    }

    //用户目的=占比
    const rule5Score = 1.0;
    totalScore += rule5Score;
    if (purpose === UserPurpose.PROPORTION) {
      score += rule5Score;
      scoreDetails.rule5 = rule5Score;
    }

    return {
      chartType: ChartType.COLUMN_PERCENT,
      score: score / totalScore,
      originScore: score,
      fullMark: totalScore,
      scoreDetails,
      cell,
      dataset
    };
  };

  const calBar = (): ScoreResult => {
    if (!inputDataSet || inputDataSet.length === 0) {
      return {
        chartType: ChartType.COLUMN,
        score: 0,
        fullMark: 0,
        originScore: 0,
        scoreDetails: [],
        error: 'Empty dataset'
      };
    }
    let score = 0;
    let totalScore = 0;
    const scoreDetails: any = {};

    if (error) {
      return {
        chartType: ChartType.COLUMN,
        score: 0,
        scoreDetails,
        fullMark: 0,
        originScore: 0,
        error: error ? errMsg : ''
      };
    }

    const dimensionLength = dimList.length - cell.row.length - cell.column.length;
    const measureLength = measureList.length;

    //维度数>1（不能是平行柱状图）
    //databot中，维度数>=1，指标数>=1
    const rule1Score = 1.0;
    totalScore += rule1Score;

    if (dimensionLength >= 1 && measureLength >= 1) {
      score += rule1Score;
      scoreDetails.rule1 = rule1Score;
    } else {
      return {
        chartType: ChartType.COLUMN,
        score: 0,
        scoreDetails,
        originScore: 0,
        fullMark: 0
      };
    }

    //指标最大值里面最大的/指标Q1(下四分位数)里面最小的<100（指标数值在同一个量级）
    const rule2Score = 3.0;
    totalScore += rule2Score;

    let maxMax = Math.max(...measureList.map(measure => Math.abs(measure.max)));
    let minQ1 = Math.min(...measureList.map(measure => Math.abs(measure.Q1)));
    if (maxMax === 0) {
      maxMax = 1;
    }
    if (minQ1 === 0) {
      minQ1 = 1;
    }

    if (maxMax / minQ1 < 100) {
      score += rule2Score;
      scoreDetails.rule2 = rule2Score;
    }

    //2<=图元数量<=30 (根据屏幕尺寸调整)
    const rule3Score = 1.0;
    totalScore += rule3Score;

    const axisSize = dataUtils.unique(uniqueIdMap[cell.x[0]].data).length;
    const dataSize = measureLength * axisSize;

    if (dataSize <= MAX_BAR_NUMBER && dataSize >= MIN_BAR_NUMBER) {
      score += rule3Score;
      scoreDetails.rule3 = rule3Score;
    }

    //图例数量<=150 (根据屏幕尺寸调整)
    const rule4Score = 1.0;
    totalScore += rule4Score;

    const colorSize = cell.color.length > 0 ? dataUtils.unique(dataset.map(data => data[COLOR_FIELD])).length : 1;

    if (colorSize <= MAX_BAR_NUMBER) {
      score += rule4Score;
      scoreDetails.rule4 = rule4Score;
    }

    //屏幕尺寸=小
    const rule5Score = 1.0;
    totalScore += rule5Score;
    if (screen === ScreenSize.SMALL) {
      score += rule5Score;
      scoreDetails.rule4 = rule5Score;
    }

    return {
      chartType: ChartType.COLUMN,
      score: score / totalScore,
      originScore: score,
      fullMark: totalScore,
      scoreDetails,
      cell,
      dataset
    };
  };

  //数据差异过大时，使用组合柱状图。
  const calCombination = (): ScoreResult => {
    let score = 0;
    let totalScore = 0;
    const scoreDetails: any = {};

    if (error) {
      return {
        chartType: ChartType.COMBINATION,
        score: 0,
        scoreDetails,
        originScore: 0,
        fullMark: 0,
        error: error ? errMsg : null
      };
    }

    //根据cell决定参与图表推荐的字段
    const measureLength = measureList.length;

    //维度数>0，指标数>1
    const rule1Score = 1.0;
    totalScore += rule1Score;
    if (measureLength > 1 && cell.x.length > 0) {
      score += rule1Score;
      scoreDetails.rule1 = rule1Score;
    } else {
      return {
        chartType: ChartType.COMBINATION,
        score: 0,
        scoreDetails,
        originScore: 0,
        fullMark: 0
      };
    }

    //指标最大值里面最大的/指标Q1(下四分位数)里面最小的>100（不同指标数值不在同一个量级）
    const rule2Score = 1.0;
    totalScore += rule2Score;
    let minQ1 = Math.min(...measureList.map(measure => Math.abs(measure.Q1)));
    let maxMax = Math.max(...measureList.map(measure => Math.abs(measure.max)));
    if (maxMax === 0) {
      maxMax = 1;
    }
    if (minQ1 === 0) {
      minQ1 = 1;
    }

    if (maxMax / minQ1 > 100) {
      score += rule2Score;
      scoreDetails.rule2 = rule2Score;
    }

    //同一个指标里面最小bar的数值/最大bar的数值>1%
    const rule3Score = 3.0;
    totalScore += rule3Score;
    const score3Flag = measureList.reduce((prev, cur) => {
      if (prev) {
        return cur.min / cur.max > 0.01;
      }
      return false;
    }, true);
    if (score3Flag) {
      score += rule3Score;
      scoreDetails.rule3 = rule3Score;
    }

    //2<=图元数量<=30 (根据屏幕尺寸调整)
    const rule4Score = 1.0;
    totalScore += rule4Score;

    const colorSize = cell.color.length > 0 ? dataUtils.unique(dataset.map(data => data[COLOR_FIELD])).length : 1;
    const axisSize = dataUtils.unique(uniqueIdMap[cell.x[0]].data).length;

    const dataSize = axisSize * colorSize;
    if (dataSize <= MAX_BAR_NUMBER && dataSize >= MIN_BAR_NUMBER) {
      score += rule4Score;
      scoreDetails.rule4 = rule4Score;
    }

    //计算cells
    const combineMetadata = processCombination(
      datasetWithoutFold,
      dimensionID,
      measureID,
      aliasMap,
      maxRowNum,
      maxColNum
    );

    const combineDatasets: Dataset[] = combineMetadata.map(metaData => metaData.dataset);
    const combineCells: any[] = combineMetadata.map(metaData => metaData.cell);

    // 透视分析
    const {
      datasets: combinePivotDataSet,
      colPivotTree,
      rowPivotTree
    } = pivotCombination(combineDatasets, colList, rowList);

    return {
      chartType: ChartType.COMBINATION,
      score: score / totalScore,
      scoreDetails,
      originScore: score,
      fullMark: totalScore,
      cell: combineCells,
      dataset: combinePivotDataSet
    };
  };

  const calScatterplot = (): ScoreResult => {
    if (!inputDataSet || inputDataSet.length === 0) {
      return {
        chartType: ChartType.SCATTER,
        score: 0,
        fullMark: 0,
        originScore: 0,
        scoreDetails: [],
        error: 'Empty dataset'
      };
    }
    let score = 0;
    let totalScore = 0;
    const scoreDetails: any = {};

    const dimensionID = dimList.map(dim => dim.uniqueID);
    const measureID = measureList.map(measure => measure.uniqueID);

    const scatterData = assignScatterPlot(datasetWithoutFold, dimensionID, measureID, aliasMap);

    const { scatterCell, dataset, colorItems, aliasMap: newAliasMap, error, errMsg } = scatterData;

    if (error) {
      return {
        chartType: ChartType.SCATTER,
        score: 0,
        scoreDetails,
        originScore: 0,
        fullMark: 0,
        error: error ? errMsg : null
      };
    }
    //维度数>0,指标数>=2，维度+指标<=5
    const rule1Score = 1.0;
    totalScore += rule1Score;
    if (scatterCell.x.length > 0 && scatterCell.y.length > 0) {
      score += rule1Score;
      scoreDetails.rule1 = rule1Score;
    } else {
      return {
        chartType: ChartType.SCATTER,
        score: 0,
        scoreDetails,
        originScore: 0,
        fullMark: 0
      };
    }

    //数据个数>30 <最大数量限制(根据屏幕尺寸调整)
    const rule2Score = 1.0;
    totalScore += rule2Score;
    if (datasetWithoutFold.length >= 30 && datasetWithoutFold.length <= 1000) {
      score += rule2Score;
      scoreDetails.rule2 = rule2Score;
    }

    //数据分布不能太集中

    return {
      chartType: ChartType.SCATTER,
      score: score / totalScore,
      scoreDetails,
      originScore: score,
      fullMark: totalScore,
      cell: scatterCell,
      dataset
    };
  };

  const calLineChart = (): ScoreResult => {
    if (!inputDataSet || inputDataSet.length === 0) {
      return {
        chartType: ChartType.LINE,
        score: 0,
        fullMark: 0,
        originScore: 0,
        scoreDetails: [],
        error: 'Empty dataset'
      };
    }
    let score = 0;
    let totalScore = 0;
    const scoreDetails: any = {};

    //折线图先进行预排序
    const lineChartDimID: UniqueId[] = sortTimeDim(dimList, maxRowNum, maxColNum);

    const {
      cell: lineChartCell,
      dataset: lineDataset,
      error,
      errMsg
    } = assignPivotCharts(originDataset, lineChartDimID, measureID, aliasMap, maxRowNum, maxColNum);
    if (error) {
      return {
        chartType: ChartType.LINE,
        score: 0,
        scoreDetails,
        originScore: 0,
        fullMark: 0,
        error: error ? errMsg : null
      };
    }

    //维度数=1且为时间，指标数>=1或维度=2且只有一个时间，指标数=1,非时间维度基数不能太多
    const rule1Score = 2.0;
    totalScore += rule1Score - 1.0;
    const _colorItems: string[] = getDomainFromDataset(lineDataset, COLOR_FIELD);
    const colorItemCardinal = lineDataset.hasOwnProperty(COLOR_FIELD) ? dataUtils.unique(_colorItems).length : 1;
    if (timeDim.length > 0 && cell.y.length > 0 && colorItemCardinal <= 50) {
      score += rule1Score;
      scoreDetails.rule1 = rule1Score;
    } else {
      return {
        chartType: ChartType.LINE,
        score: 0,
        scoreDetails,
        originScore: 0,
        fullMark: 0
      };
    }

    //指标数>1时，指标最大值里面最大的/指标Q1(下四分位数)里面最小的<100（不同指标数值在同一个量级）
    const rule2Score = 1.0;
    if (measureList.length > 1) {
      totalScore += rule2Score;
      let minQ1 = Math.min(...measureList.map(measure => Math.abs(measure.Q1)));
      let maxMax = Math.max(...measureList.map(measure => Math.abs(measure.max)));
      if (minQ1 === 0) {
        minQ1 = 1;
      }
      if (maxMax === 0) {
        maxMax = 1;
      }

      if (maxMax / minQ1 <= 100) {
        score += rule2Score;
        scoreDetails.rule2 = rule2Score;
      }
    }

    //变异系数>x (需要调整)
    const rule3Score = 1.0;
    totalScore += rule3Score;
    const coefficientFlag = measureList.reduce((prev, cur) => {
      if (!prev) {
        return false;
      } else {
        if (cur.coefficient) {
          return cur.coefficient >= 0.2;
        } else {
          return true;
        }
      }
    }, true);

    if (coefficientFlag) {
      score += rule3Score;
      scoreDetails.rule3 = rule3Score;
    }

    // 透视分析
    const {
      datasets: lineChartDataset,
      colPivotTree,
      rowPivotTree
    } = pivot(lineDataset, colList, rowList, lineChartCell.y);

    return {
      chartType: ChartType.LINE,
      score: score / totalScore,
      originScore: score,
      fullMark: totalScore,
      scoreDetails,
      cell: lineChartCell,
      dataset: lineDataset
    };
  };

  const calLineChartCombine = (): ScoreResult => {
    //组合折线图
    let score = 0;
    let totalScore = 0;
    const scoreDetails: any = {};

    //折线图先进行预排序
    const lineChartDimID: UniqueId[] = sortTimeDim(dimList, maxRowNum, maxColNum);

    const {
      cell: lineChartCell,
      dataset: lineDataset,
      error,
      errMsg
    } = assignPivotCharts(originDataset, lineChartDimID, measureID, aliasMap, maxRowNum, maxColNum);

    if (error) {
      return {
        chartType: ChartType.LINE,
        score: 0,
        scoreDetails,
        fullMark: 0,
        originScore: 0,
        error: error ? errMsg : null
      };
    }

    //维度数=1且为时间，指标数>=1或维度=2且只有一个时间，指标数=1,非时间维度基数不能太多
    const rule1Score = 2.0;
    totalScore += rule1Score - 1.0;
    const _colorItems: string[] = getDomainFromDataset(lineDataset, COLOR_FIELD);
    const colorItemCardinal = lineDataset.hasOwnProperty(COLOR_FIELD) ? dataUtils.unique(_colorItems).length : 1;
    if (timeDim.length > 0 && cell.y.length > 0 && colorItemCardinal <= 50) {
      score += rule1Score;
      scoreDetails.rule1 = rule1Score;
    } else {
      return {
        chartType: ChartType.LINE,
        score: 0,
        scoreDetails,
        fullMark: 0,
        originScore: 0
      };
    }

    //指标数>1时，指标最大值里面最大的/指标Q1(下四分位数)里面最小的>100（不同指标数值不在同一个量级）
    const rule2Score = 1.0;
    if (measureList.length > 1) {
      totalScore += rule2Score;
      let minQ1 = Math.min(...measureList.map(measure => Math.abs(measure.Q1)));
      let maxMax = Math.max(...measureList.map(measure => Math.abs(measure.max)));
      if (minQ1 === 0) {
        minQ1 = 1;
      }
      if (maxMax === 0) {
        maxMax = 1;
      }

      if (maxMax / minQ1 > 100) {
        score += rule2Score;
        scoreDetails.rule2 = rule2Score;
      }
    }

    //变异系数>x (需要调整)
    const rule3Score = 1.0;
    totalScore += rule3Score;
    const coefficientFlag = measureList.reduce((prev, cur) => {
      if (!prev) {
        return false;
      } else {
        if (cur.coefficient) {
          return cur.coefficient >= 0.2;
        } else {
          return true;
        }
      }
    }, true);

    if (coefficientFlag) {
      score += rule3Score;
      scoreDetails.rule3 = rule3Score;
    }

    //计算cells
    const combineMetadata = processCombination(
      datasetWithoutFold,
      lineChartDimID,
      measureID,
      aliasMap,
      maxRowNum,
      maxColNum
    );

    const combineDatasets: Dataset[] = combineMetadata.map(metaData => metaData.dataset);

    // 透视分析
    const {
      datasets: combinePivotDataSet,
      colPivotTree,
      rowPivotTree
    } = pivotCombination(combineDatasets, colList, rowList);

    return {
      chartType: ChartType.EXTEND, //暂时用扩展类型来代替
      score: score / totalScore,
      scoreDetails,
      originScore: score,
      fullMark: totalScore
    };
  };

  const calPieChart = (): ScoreResult => {
    if (!inputDataSet || inputDataSet.length === 0) {
      return {
        chartType: ChartType.PIE,
        score: 0,
        fullMark: 0,
        originScore: 0,
        scoreDetails: [],
        error: 'Empty dataset'
      };
    }
    let score = 0;
    let totalScore = 0;
    const scoreDetails: any = {};

    const pieChartData = assignPieChart(originDataset, dimensionID, measureID, aliasMap);

    const { pieCell, dataset: pieDataset, colorItems, aliasMap: newAliasMap, error, errMsg } = pieChartData;

    if (error) {
      return {
        chartType: ChartType.PIE,
        score: 0,
        scoreDetails,
        fullMark: 0,
        originScore: 0,
        error: error ? errMsg : null
      };
    }

    //维度数=0，指标数>=3
    const rule1Score = 2.0;
    totalScore += rule1Score;
    if (dimList.length === 0 && measureList.length >= 3) {
      score += rule1Score;
      scoreDetails.rule1 = rule1Score;
    } else {
      return {
        chartType: ChartType.PIE,
        score: 0,
        scoreDetails,
        originScore: 0,
        fullMark: 0
      };
    }

    //数据个数<=20
    const rule2Score = 2.0;
    totalScore += rule2Score;
    if (measureList.length <= 20) {
      score += rule2Score;
      scoreDetails.rule2 = rule2Score;
    }

    //维度最小值/维度最大值>0.1
    const rule3Score = 3.0;
    totalScore += rule3Score;
    measureList.map(measure => measure.min);
    const minMeasure = Math.min(...measureList.map(measure => measure.min));
    const maxMeasure = Math.max(...measureList.map(measure => measure.max));
    if (minMeasure / maxMeasure > 0.1) {
      score += rule3Score;
      scoreDetails.rule3 = rule3Score;
    }

    //变异系数>x (需要调整)
    const rule4Score = 1.0;
    totalScore += rule4Score;
    //当维度数=0时，计算指标的变异系数
    if (dimList.length === 0) {
      const tempDataset: MeasureDataset = {
        data: measureList.reduce((prev, cur) => prev.concat(cur.data), [])
      };
      const coefficient = dataUtils.calCoefficient(tempDataset);
      if (!coefficient || coefficient > 0.2) {
        score += rule4Score;
        scoreDetails.rule4 = rule4Score;
      }
    }

    //得分归一化用于比较

    return {
      chartType: ChartType.PIE,
      score: score / totalScore,
      originScore: score,
      fullMark: totalScore,
      scoreDetails,
      cell: pieCell,
      dataset: pieDataset
    };
  };

  const calMeasureCard = (): ScoreResult => {
    let score = 0;
    let totalScore = 0;
    const scoreDetails: any = {};

    //1<=指标数<=3，维度数=0
    const rule1Score = 2.0;
    totalScore += rule1Score;
    if (dimList.length === 0 && measureList.length <= 3 && measureList.length >= 1) {
      score += rule1Score;
      scoreDetails.rule1 = rule1Score;
    } else {
      return {
        chartType: ChartType.MEASURE_CARD,
        score: 0,
        scoreDetails,
        originScore: 0,
        fullMark: 0
      };
    }

    const cardData = assignMeasureCard(datasetWithoutFold, dimensionID, measureID, aliasMap);

    const { cardCell, dataset: cardDataset } = cardData;

    return {
      chartType: ChartType.MEASURE_CARD,
      score: score / totalScore,
      originScore: score,
      fullMark: totalScore,
      scoreDetails,
      cell: cardCell,
      dataset: cardDataset
    };
  };

  const calRadar = (): ScoreResult => {
    if (!inputDataSet || inputDataSet.length === 0) {
      return {
        chartType: ChartType.RADAR,
        score: 0,
        fullMark: 0,
        originScore: 0,
        scoreDetails: [],
        error: 'Empty dataset'
      };
    }
    let score = 0;
    let totalScore = 0;
    const scoreDetails: any = {};
    if (error) {
      return {
        chartType: ChartType.RADAR,
        score: 0,
        scoreDetails,
        originScore: 0,
        fullMark: 0,
        error: error ? errMsg : null
      };
    }

    //1<=维度数<=2，指标数=1，或者维度数=1，指标数>=1
    const rule1Score = 1.0;
    totalScore += rule1Score;
    if (cell.x.length > 0 && cell.y.length > 0) {
      score += rule1Score;
      scoreDetails.rule1 = rule1Score;
    } else {
      return {
        chartType: ChartType.RADAR,
        score: 0,
        scoreDetails,
        originScore: 0,
        fullMark: 0
      };
    }

    //用户目的=分布
    const rule2Score = 5.0;
    totalScore += rule2Score;
    if (purpose === UserPurpose.DISTRIBUTION) {
      score += rule2Score;
      scoreDetails.rule2 = rule2Score;
    }

    return {
      chartType: ChartType.RADAR,
      score: score / totalScore,
      fullMark: totalScore,
      originScore: score,
      scoreDetails,
      cell,
      dataset
    };
  };

  const calWordCloud = (): ScoreResult => {
    if (!inputDataSet || inputDataSet.length === 0) {
      return {
        chartType: ChartType.WORD_CLOUD,
        score: 0,
        fullMark: 0,
        originScore: 0,
        scoreDetails: [],
        error: 'Empty dataset'
      };
    }
    let score = 0;
    let totalScore = 0;
    const scoreDetails: any = {};

    const rule1Score = 1.0;
    totalScore += rule1Score;
    if (dimList.length === 1 && measureList.length == 0) {
      score += rule1Score;
      scoreDetails.rule1 = rule1Score;
    } else {
      return {
        chartType: ChartType.WORD_CLOUD,
        score: 0,
        scoreDetails,
        originScore: 0,
        fullMark: 0
      };
    }

    //数据基数>=10且<=100
    const rule2Score = 2.0;
    totalScore += rule2Score;
    if (dimList[0].cardinal >= 20 && dimList[0].cardinal <= 100) {
      score += rule2Score;
      scoreDetails.rule2 = rule2Score;
    }

    //用户目的=storyTelling
    const rule3Score = 5.0;
    totalScore += rule3Score;
    if (purpose === UserPurpose.STORYTELLING) {
      score += rule3Score;
      scoreDetails.rule3 = rule3Score;
    }

    const wordCloudCell: AutoChartCell = {
      x: [],
      y: [],
      row: [],
      column: [],
      color: [],
      size: [],
      angle: []
    };

    wordCloudCell.color.push(dimList[0].uniqueID);

    if (measureList.length > 0) {
      wordCloudCell.size.push(measureList[0].uniqueID);
    }

    return {
      chartType: ChartType.WORD_CLOUD,
      score: score / totalScore,
      originScore: score,
      fullMark: totalScore,
      scoreDetails,
      cell: wordCloudCell,
      dataset
    };
  };

  const calFunnelChart = (): ScoreResult => {
    if (!inputDataSet || inputDataSet.length === 0) {
      return {
        chartType: ChartType.FUNNEL,
        score: 0,
        fullMark: 0,
        originScore: 0,
        scoreDetails: [],
        error: 'Empty dataset'
      };
    }
    let score = 0;
    let totalScore = 0;
    const scoreDetails: any = {};

    //维度数=1，指标数=1，或者维度数=0，指标数>=2，
    const rule1Score = 1.0;
    totalScore += rule1Score;
    if ((dimList.length === 1 && measureList.length === 1) || (dimList.length === 0 && measureList.length >= 2)) {
      score += rule1Score;
      scoreDetails.rule1 = rule1Score;
    } else {
      return {
        chartType: ChartType.FUNNEL,
        score: 0,
        scoreDetails,
        originScore: 0,
        fullMark: 0
      };
    }

    //用户目的=Trend
    const rule2Score = 5.0;
    totalScore += rule2Score;
    if (purpose === UserPurpose.TREND) {
      score += rule2Score;
      scoreDetails.rule2 = rule2Score;
    }

    const { funnelCell, dataset: funnelDataset } = assignFunnelChart(originDataset, dimensionID, measureID, aliasMap);

    return {
      chartType: ChartType.FUNNEL,
      score: score / totalScore,
      originScore: score,
      fullMark: totalScore,
      scoreDetails,
      cell: funnelCell,
      dataset: funnelDataset
    };
  };

  const calDualAxis = (): ScoreResult => {
    if (!inputDataSet || inputDataSet.length === 0) {
      return {
        chartType: ChartType.DUAL_AXIS,
        score: 0,
        fullMark: 0,
        originScore: 0,
        scoreDetails: [],
        error: 'Empty dataset'
      };
    }
    //多度量且度量之间差异过大，用双轴图

    let score = 0;
    let totalScore = 0;
    const scoreDetails: any = {};

    if (!(measureList.length === 2 && dimList.length > 0)) {
      return {
        chartType: ChartType.DUAL_AXIS,
        score: 0,
        scoreDetails,
        originScore: 0,
        fullMark: 0
      };
    }

    //计算cells
    const dualAxisData = assignDualAxis(datasetWithoutFold, dimensionID, [measureID[0]], [measureID[1]], aliasMap);

    const { error: newError, errorMsg, dataset, cell: newCell, colorItems, aliasMap: newAliasMap } = dualAxisData;

    if (newError) {
      return {
        chartType: ChartType.DUAL_AXIS,
        score: 0,
        scoreDetails,
        originScore: 0,
        fullMark: 0,
        error: error ? errMsg : null
      };
    }

    //根据cell决定参与图表推荐的字段
    const measureLength = measureList.length;

    //指标数=2
    const rule1Score = 1.0;
    totalScore += rule1Score;
    if (measureLength === 2 && newCell.x.length > 0) {
      score += rule1Score;
      scoreDetails.rule1 = rule1Score;
    } else {
      return {
        chartType: ChartType.DUAL_AXIS,
        score: 0,
        scoreDetails,
        originScore: 0,
        fullMark: 0
      };
    }

    //指标最大值里面最大的/指标Q1(下四分位数)里面最小的>100（不同指标数值不在同一个量级）
    const rule2Score = 1.0;
    totalScore += rule2Score;
    let minQ1 = Math.min(...measureList.map(measure => Math.abs(measure.Q1)));
    let maxMax = Math.max(...measureList.map(measure => Math.abs(measure.max)));

    if (minQ1 === 0) {
      minQ1 = 1;
    }
    if (maxMax === 0) {
      maxMax = 1;
    }

    if (maxMax / minQ1 > 100) {
      score += rule2Score;
      scoreDetails.rule2 = rule2Score;
    }

    /*     //同一个指标里面最小bar的数值/最大bar的数值>1%
        const rule3Score = 3.0
        totalScore += rule3Score
        const score3Flag = measureList.reduce((prev, cur) => {
          if (prev) {
            return cur.min / cur.max > 0.01
          }
          return false
        }, true)
        if (score3Flag) {
          score += rule3Score
          scoreDetails .rule3 = rule3Score

        } */

    //2<=图元数量<=20 (根据屏幕尺寸调整)
    const rule4Score = 1.0;
    totalScore += rule4Score;

    const colorSize = newCell.color.length > 0 ? dataUtils.unique(dataset.map(data => data[COLOR_FIELD])).length : 1;
    const axisSize = dataUtils.unique(uniqueIdMap[newCell.x[0]].data).length;

    const dataSize = axisSize;
    if (dataSize <= MAX_BAR_NUMBER && dataSize >= MIN_BAR_NUMBER) {
      score += rule4Score;
      scoreDetails.rule4 = rule4Score;
    }

    return {
      chartType: ChartType.DUAL_AXIS,
      score: score / totalScore,
      originScore: score,
      fullMark: totalScore,
      scoreDetails,
      cell: newCell,
      dataset
    };
  };

  const calTable = (): ScoreResult => {
    //图例数量过多时，推荐表格
    let score = 0;
    let totalScore = 0;
    const scoreDetails: any = {};

    const rule1Score = 2.0;
    totalScore += rule1Score;

    const colorSize = cell.color.length > 0 ? dataUtils.unique(dataset.map(data => data[COLOR_FIELD])).length : 1;

    let axisSize;
    if (cell.x.length > 0) {
      axisSize = dataUtils.unique(uniqueIdMap[cell.x[0]].data).length;
    } else {
      axisSize = 1;
    }

    const dataSize = colorSize * axisSize;

    if (dataSize >= 100) {
      score += rule1Score;
      scoreDetails.rule4 = rule1Score;
    }

    return {
      chartType: ChartType.TABLE,
      score: score / totalScore,
      originScore: score,
      fullMark: totalScore,
      scoreDetails,
      cell,
      dataset
    };
  };

  const scoreCalculators = [
    calBar,
    calBarPercent,
    calBarParallel,
    //calCombination,
    calScatterplot,
    calLineChart,
    // calLineChartCombine,
    calPieChart,
    //calMeasureCard,
    calRadar,
    calWordCloud,
    calFunnelChart,
    calDualAxis
    //calTable
  ];

  return scoreCalculators;
};
