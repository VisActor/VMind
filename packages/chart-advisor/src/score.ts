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

// 通用bar评分工具函数
function baseBarScore({
  chartType,
  inputDataSet,
  error,
  errMsg,
  cell,
  dataset,
  measureList,
  uniqueIdMap,
  ruleConfig = {},
  extraRules = () => ({}),
  purpose,
  screen
}: any): ScoreResult {
  if (!inputDataSet || inputDataSet.length === 0) {
    return {
      chartType,
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
      chartType,
      originScore: 0,
      fullMark: 0,
      score: 0,
      scoreDetails,
      error: error ? errMsg : null
    };
  }

  // 规则1: 维度/指标数判断
  if (ruleConfig.dimensionCheck) {
    const { dimensionLength, measureLength } = ruleConfig.dimensionCheck;
    totalScore += ruleConfig.dimensionCheck.score;
    if (ruleConfig.dimensionCheck.check()) {
      score += ruleConfig.dimensionCheck.score;
      scoreDetails.rule1 = ruleConfig.dimensionCheck.score;
    } else {
      return {
        chartType,
        score: 0,
        fullMark: 0,
        originScore: 0,
        scoreDetails
      };
    }
  }

  // 规则2: max/Q1 量级判断
  if (ruleConfig.maxQ1Check) {
    const rule2Score = ruleConfig.maxQ1Check.score;
    totalScore += rule2Score;
    let maxMax = Math.max(...measureList.map(measure => Math.abs(measure.max)));
    let minQ1 = Math.min(...measureList.map(measure => Math.abs(measure.Q1)));
    if (maxMax === 0) maxMax = 1;
    if (minQ1 === 0) minQ1 = 1;
    if (ruleConfig.maxQ1Check.check(maxMax, minQ1)) {
      score += rule2Score;
      scoreDetails.rule2 = rule2Score;
    }
  }

  // 规则3: 图元数量判断
  if (ruleConfig.dataSizeCheck) {
    const rule3Score = ruleConfig.dataSizeCheck.score;
    totalScore += rule3Score;
    const axisSize = ruleConfig.dataSizeCheck.axisSizeGetter();
    const dataSize = ruleConfig.dataSizeCheck.dataSizeGetter(axisSize);
    if (ruleConfig.dataSizeCheck.check(dataSize)) {
      score += rule3Score;
      scoreDetails[ruleConfig.dataSizeCheck.detailKey || 'rule3'] = rule3Score;
    }
  }

  // 规则4: 图例数量判断
  if (ruleConfig.colorSizeCheck) {
    const rule4Score = ruleConfig.colorSizeCheck.score;
    totalScore += rule4Score;
    const colorSize =
      cell.color.length > 0 ? dataUtils.unique(dataset.map((data: any) => data[COLOR_FIELD])).length : 1;
    if (ruleConfig.colorSizeCheck.check(colorSize)) {
      score += rule4Score;
      scoreDetails[ruleConfig.colorSizeCheck.detailKey || 'rule4'] = rule4Score;
    }
  }

  // 规则5: 其它（如用户目的、屏幕尺寸等）
  if (ruleConfig.extraRule) {
    const { score: extraScore, check, detailKey } = ruleConfig.extraRule;
    totalScore += extraScore;
    if (check({ purpose, screen })) {
      score += extraScore;
      scoreDetails[detailKey || 'rule5'] = extraScore;
    }
  }

  // 其它自定义规则
  const extra = extraRules({ score, totalScore, scoreDetails });
  if (extra && extra.override) return extra.override;
  if (extra && extra.mutate) {
    score = extra.mutate.score;
    totalScore = extra.mutate.totalScore;
    Object.assign(scoreDetails, extra.mutate.scoreDetails);
  }

  return {
    chartType,
    score: score / totalScore,
    originScore: score,
    fullMark: totalScore,
    scoreDetails,
    cell,
    dataset
  };
}

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
    return baseBarScore({
      chartType: ChartType.COLUMN_PARALLEL,
      inputDataSet,
      error,
      errMsg,
      cell,
      dataset,
      measureList,
      uniqueIdMap,
      ruleConfig: {
        dimensionCheck: {
          score: 1.0,
          check: () => cell.x.length > 0 && cell.y.length > 0
        },
        maxQ1Check: {
          score: 3.0,
          check: (maxMax: number, minQ1: number) => maxMax / minQ1 < 100
        },
        dataSizeCheck: {
          score: 4.0,
          axisSizeGetter: () => dataUtils.unique(uniqueIdMap[cell.x[0]].data).length,
          dataSizeGetter: (axisSize: number) => {
            const colorSize =
              cell.color.length > 0 ? dataUtils.unique(dataset.map((data: any) => data[COLOR_FIELD])).length : 1;
            return colorSize * axisSize;
          },
          check: (dataSize: number) => dataSize <= MAX_BAR_NUMBER && dataSize >= MIN_BAR_NUMBER,
          detailKey: 'rule4'
        }
      }
    });
  };

  const calBarPercent = (): ScoreResult => {
    const dimensionLength = dimList.length - cell.row.length - cell.column.length;
    const measureLength = measureList.length;
    return baseBarScore({
      chartType: ChartType.COLUMN_PERCENT,
      inputDataSet,
      error,
      errMsg,
      cell,
      dataset,
      measureList,
      uniqueIdMap,
      purpose,
      ruleConfig: {
        dimensionCheck: {
          score: 1.0,
          check: () => dimensionLength > 1 && measureLength > 0
        },
        maxQ1Check: {
          score: 3.0,
          check: (maxMax: number, minQ1: number) => maxMax / minQ1 < 100
        },
        dataSizeCheck: {
          score: 1.0,
          axisSizeGetter: () => dataUtils.unique(uniqueIdMap[cell.x[0]].data).length,
          dataSizeGetter: (axisSize: number) => axisSize * measureLength,
          check: (dataSize: number) => dataSize <= MAX_BAR_NUMBER && dataSize >= MIN_BAR_NUMBER
        },
        colorSizeCheck: {
          score: 1.0,
          check: (colorSize: number) => colorSize <= MAX_BAR_NUMBER
        },
        extraRule: {
          score: 1.0,
          check: ({ purpose }: any) => purpose === UserPurpose.PROPORTION,
          detailKey: 'rule5'
        }
      }
    });
  };

  const calBar = (): ScoreResult => {
    const dimensionLength = dimList.length - cell.row.length - cell.column.length;
    const measureLength = measureList.length;
    return baseBarScore({
      chartType: ChartType.COLUMN,
      inputDataSet,
      error,
      errMsg,
      cell,
      dataset,
      measureList,
      uniqueIdMap,
      screen,
      ruleConfig: {
        dimensionCheck: {
          score: 1.0,
          check: () => dimensionLength >= 1 && measureLength >= 1
        },
        maxQ1Check: {
          score: 3.0,
          check: (maxMax: number, minQ1: number) => maxMax / minQ1 < 100
        },
        dataSizeCheck: {
          score: 1.0,
          axisSizeGetter: () => dataUtils.unique(uniqueIdMap[cell.x[0]].data).length,
          dataSizeGetter: (axisSize: number) => measureLength * axisSize,
          check: (dataSize: number) => dataSize <= MAX_BAR_NUMBER && dataSize >= MIN_BAR_NUMBER
        },
        colorSizeCheck: {
          score: 1.0,
          check: (colorSize: number) => colorSize <= MAX_BAR_NUMBER
        },
        extraRule: {
          score: 1.0,
          check: ({ screen }: any) => screen === ScreenSize.SMALL,
          detailKey: 'rule4'
        }
      }
    });
  };

  //数据差异过大时，使用组合柱状图。
  const calCombination = (): ScoreResult => {
    const measureLength = measureList.length;
    return baseBarScore({
      chartType: ChartType.COMBINATION,
      inputDataSet,
      error,
      errMsg,
      cell,
      dataset,
      measureList,
      uniqueIdMap,
      ruleConfig: {
        dimensionCheck: {
          score: 1.0,
          check: () => measureLength > 1 && cell.x.length > 0 && dimList.length === 1
        },
        maxQ1Check: {
          score: 1.0,
          check: (maxMax: number, minQ1: number) => maxMax / minQ1 > 100
        },
        dataSizeCheck: {
          score: 1.0,
          axisSizeGetter: () => dataUtils.unique(uniqueIdMap[cell.x[0]].data).length,
          dataSizeGetter: (axisSize: number) => {
            const colorSize =
              cell.color.length > 0 ? dataUtils.unique(dataset.map((data: any) => data[COLOR_FIELD])).length : 1;
            return axisSize * colorSize;
          },
          check: (dataSize: number) => dataSize <= MAX_BAR_NUMBER && dataSize >= MIN_BAR_NUMBER,
          detailKey: 'rule4'
        }
      },
      extraRules: ({ score, totalScore, scoreDetails }) => {
        // 同一个指标里面最小bar的数值/最大bar的数值>1%
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
        // 计算cells和dataset
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
        const { datasets: combinePivotDataSet } = pivotCombination(combineDatasets, colList, rowList);
        return {
          mutate: {
            score,
            totalScore,
            scoreDetails
          },
          override: {
            chartType: ChartType.COMBINATION,
            score: score / totalScore,
            scoreDetails,
            originScore: score,
            fullMark: totalScore,
            cell: combineCells,
            dataset: combinePivotDataSet
          }
        };
      }
    });
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
    const dimensionID = dimList.map(dim => dim.uniqueID);
    const measureID = measureList.map(measure => measure.uniqueID);
    const scatterData = assignScatterPlot(datasetWithoutFold, dimensionID, measureID, aliasMap);
    const { scatterCell, dataset, error, errMsg } = scatterData;
    return baseBarScore({
      chartType: ChartType.SCATTER,
      inputDataSet,
      error,
      errMsg,
      cell: scatterCell,
      dataset,
      measureList,
      uniqueIdMap,
      ruleConfig: {
        dimensionCheck: {
          score: 1.0,
          check: () => scatterCell.x.length > 0 && scatterCell.y.length > 0
        },
        dataSizeCheck: {
          score: 1.0,
          axisSizeGetter: () => datasetWithoutFold.length,
          dataSizeGetter: (n: number) => n,
          check: (n: number) => n >= 30 && n <= 1000,
          detailKey: 'rule2'
        }
      },
      extraRules: ({ score, totalScore, scoreDetails }) => ({ mutate: { score, totalScore, scoreDetails } })
    });
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
    const lineChartDimID: UniqueId[] = sortTimeDim(dimList, maxRowNum, maxColNum);
    const {
      cell: lineChartCell,
      dataset: lineDataset,
      error,
      errMsg
    } = assignPivotCharts(originDataset, lineChartDimID, measureID, aliasMap, maxRowNum, maxColNum);
    return baseBarScore({
      chartType: ChartType.LINE,
      inputDataSet,
      error,
      errMsg,
      cell: lineChartCell,
      dataset: lineDataset,
      measureList,
      uniqueIdMap,
      ruleConfig: {
        dimensionCheck: {
          score: 2.0,
          check: () =>
            timeDim.length > 0 &&
            cell.y.length > 0 &&
            (lineDataset.hasOwnProperty(COLOR_FIELD)
              ? dataUtils.unique(getDomainFromDataset(lineDataset, COLOR_FIELD)).length
              : 1) <= 50
        }
      },
      extraRules: ({ score, totalScore, scoreDetails }) => {
        // 指标数>1时，max/Q1<=100
        if (measureList.length > 1) {
          const rule2Score = 1.0;
          totalScore += rule2Score;
          let minQ1 = Math.min(...measureList.map(measure => Math.abs(measure.Q1)));
          let maxMax = Math.max(...measureList.map(measure => Math.abs(measure.max)));
          if (minQ1 === 0) minQ1 = 1;
          if (maxMax === 0) maxMax = 1;
          if (maxMax / minQ1 <= 100) {
            score += rule2Score;
            scoreDetails.rule2 = rule2Score;
          }
        }
        // 变异系数
        const rule3Score = 1.0;
        totalScore += rule3Score;
        const coefficientFlag = measureList.reduce((prev, cur) => {
          if (!prev) return false;
          if (cur.coefficient) return cur.coefficient >= 0.2;
          return true;
        }, true);
        if (coefficientFlag) {
          score += rule3Score;
          scoreDetails.rule3 = rule3Score;
        }
        return { mutate: { score, totalScore, scoreDetails } };
      }
    });
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
    const pieChartData = assignPieChart(originDataset, dimensionID, measureID, aliasMap);
    const { pieCell, dataset: pieDataset, error, errMsg } = pieChartData;
    return baseBarScore({
      chartType: ChartType.PIE,
      inputDataSet,
      error,
      errMsg,
      cell: pieCell,
      dataset: pieDataset,
      measureList,
      uniqueIdMap,
      ruleConfig: {
        dimensionCheck: {
          score: 2.0,
          check: () => dimList.length === 0 && measureList.length >= 3
        },
        dataSizeCheck: {
          score: 2.0,
          axisSizeGetter: () => measureList.length,
          dataSizeGetter: (n: number) => n,
          check: (n: number) => n <= 20,
          detailKey: 'rule2'
        }
      },
      extraRules: ({ score, totalScore, scoreDetails }) => {
        // 维度最小值/最大值>0.1
        const rule3Score = 3.0;
        totalScore += rule3Score;
        const minMeasure = Math.min(...measureList.map(measure => measure.min));
        const maxMeasure = Math.max(...measureList.map(measure => measure.max));
        if (minMeasure / maxMeasure > 0.1) {
          score += rule3Score;
          scoreDetails.rule3 = rule3Score;
        }
        // 变异系数
        const rule4Score = 1.0;
        totalScore += rule4Score;
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
        return { mutate: { score, totalScore, scoreDetails } };
      }
    });
  };

  const calRadar = (): ScoreResult => {
    return baseBarScore({
      chartType: ChartType.RADAR,
      inputDataSet,
      error,
      errMsg,
      cell,
      dataset,
      measureList,
      uniqueIdMap,
      purpose,
      ruleConfig: {
        dimensionCheck: {
          score: 1.0,
          check: () => cell.x.length > 0 && cell.y.length > 0
        },
        extraRule: {
          score: 5.0,
          check: ({ purpose }: any) => purpose === UserPurpose.DISTRIBUTION,
          detailKey: 'rule2'
        }
      }
    });
  };

  const calWordCloud = (): ScoreResult => {
    return baseBarScore({
      chartType: ChartType.WORD_CLOUD,
      inputDataSet,
      error,
      errMsg,
      cell,
      dataset,
      measureList,
      uniqueIdMap,
      purpose,
      ruleConfig: {
        dimensionCheck: {
          score: 1.0,
          check: () => dimList.length === 1 && measureList.length == 0
        },
        dataSizeCheck: {
          score: 2.0,
          axisSizeGetter: () => dimList[0]?.cardinal ?? 0,
          dataSizeGetter: (n: number) => n,
          check: (n: number) => n >= 20 && n <= 100,
          detailKey: 'rule2'
        },
        extraRule: {
          score: 5.0,
          check: ({ purpose }: any) => purpose === UserPurpose.STORYTELLING,
          detailKey: 'rule3'
        }
      },
      extraRules: ({ score, totalScore, scoreDetails }) => {
        // cell特殊处理
        const wordCloudCell: AutoChartCell = {
          x: [],
          y: [],
          row: [],
          column: [],
          color: [],
          size: [],
          angle: []
        };
        wordCloudCell.color.push(dimList[0]?.uniqueID);
        if (measureList.length > 0) {
          wordCloudCell.size.push(measureList[0].uniqueID);
        }
        return {
          mutate: { score, totalScore, scoreDetails },
          override: {
            chartType: ChartType.WORD_CLOUD,
            score: score / totalScore,
            originScore: score,
            fullMark: totalScore,
            scoreDetails,
            cell: wordCloudCell,
            dataset
          }
        };
      }
    });
  };

  const calFunnelChart = (): ScoreResult => {
    return baseBarScore({
      chartType: ChartType.FUNNEL,
      inputDataSet,
      error,
      errMsg,
      cell,
      dataset,
      measureList,
      uniqueIdMap,
      purpose,
      ruleConfig: {
        dimensionCheck: {
          score: 1.0,
          check: () =>
            (dimList.length === 1 && measureList.length === 1) || (dimList.length === 0 && measureList.length >= 2)
        },
        extraRule: {
          score: 5.0,
          check: ({ purpose }: any) => purpose === UserPurpose.TREND,
          detailKey: 'rule2'
        }
      },
      extraRules: ({ score, totalScore, scoreDetails }) => {
        const { funnelCell, dataset: funnelDataset } = assignFunnelChart(
          originDataset,
          dimensionID,
          measureID,
          aliasMap
        );
        return {
          mutate: { score, totalScore, scoreDetails },
          override: {
            chartType: ChartType.FUNNEL,
            score: score / totalScore,
            originScore: score,
            fullMark: totalScore,
            scoreDetails,
            cell: funnelCell,
            dataset: funnelDataset
          }
        };
      }
    });
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
    if (!(measureList.length === 2 && dimList.length > 0)) {
      return {
        chartType: ChartType.DUAL_AXIS,
        score: 0,
        scoreDetails: [],
        originScore: 0,
        fullMark: 0
      };
    }
    const dualAxisData = assignDualAxis(datasetWithoutFold, dimensionID, [measureID[0]], [measureID[1]], aliasMap);
    const { error: newError, errorMsg, dataset, cell: newCell } = dualAxisData;
    return baseBarScore({
      chartType: ChartType.DUAL_AXIS,
      inputDataSet,
      error: newError,
      errMsg: errorMsg,
      cell: newCell,
      dataset,
      measureList,
      uniqueIdMap,
      ruleConfig: {
        dimensionCheck: {
          score: 1.0,
          check: () => measureList.length === 2 && newCell.x.length > 0
        },
        maxQ1Check: {
          score: 1.0,
          check: (maxMax: number, minQ1: number) => maxMax / minQ1 > 100
        },
        dataSizeCheck: {
          score: 1.0,
          axisSizeGetter: () => dataUtils.unique(uniqueIdMap[newCell.x[0]].data).length,
          dataSizeGetter: (axisSize: number) => axisSize,
          check: (dataSize: number) => dataSize <= MAX_BAR_NUMBER && dataSize >= MIN_BAR_NUMBER,
          detailKey: 'rule4'
        }
      }
    });
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
    calCombination,
    calScatterplot,
    calLineChart,
    calPieChart,
    calRadar,
    calWordCloud,
    calFunnelChart,
    calDualAxis
  ];

  return scoreCalculators;
};
