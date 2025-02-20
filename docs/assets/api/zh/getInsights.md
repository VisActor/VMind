# getInsights

## 接口描述

getInsights接口会根据VChart Spec配置和洞察配置，产生当前图表的洞察结果，最终洞察结果会按照洞察置信度得分从高到低排序。

## 接口参数

```typescript
getInsights(spec: any, options?: DataInsightOptions): { insights: Insights[], usage: Usage};

export interface DataInsightOptions {
  /** 最多产生的洞察数量 */
  maxNum?: number;
  /** 具体每个洞察类型最多产生的洞察数量，优先级高于maxNum */
  detailMaxNum?: {
    types: InsightType[];
    maxNum: number;
  }[];
  /** 使用哪些算法 */
  algorithms?: AlgorithmType[];
  /** 每个算法的超参数设定 */
  algorithmOptions?: AlgorithmOptions;
  /** 洞察结果是否考虑图表类型，例如聚类算法只在散点图中使用 */
  isLimitedbyChartType?: boolean;
  /** 是否用大模型进行文本润色 */
  usePolish?: boolean;
  /** 生成文本的语言 */
  language?: 'chinese' | 'english';
}
```

### 洞察类型
具体的洞察类型如下所示，共包含12种洞察类型。
```ts
export enum InsightType {
  /** 最小值 */
  Min = 'min',
  /** 最大值 */
  Max = 'max',
  /** 平均值 */
  Avg = 'avg',
  /** 异常点 */
  Outlier = 'outlier',
  /** 极值 */
  ExtremeValue = 'extreme_value',
  /** 贡献占比巨大值 */
  MajorityValue = 'majority_value',
  /** 转折点 */
  TurningPoint = 'turning_point',
  /** 整体趋势 */
  OverallTrend = 'overall_trend',
  /** 异常趋势 */
  AbnormalTrend = 'abnormal_trend',
  /** 异常区间 */
  AbnormalBand = 'abnormal_band',
  /** 相关性 */
  Correlation = 'correlation',
  /** 周期性 */
  Volatility = 'volatility'
}
```

### 内置算法
VMind所有内置算法如下：
```ts
export enum AlgorithmType {
  /** 整体/异常趋势，使用Mann-Kendall Test 趋势检测算法 */
  OverallTrending = 'overallTrend',
  AbnormalTrend = 'abnormalTrend',
  /** Pearson Correlation Coefficient / SpearmanCorrelation 相关性检测 */
  PearsonCorrelation = 'pearsonCorrelation',
  SpearmanCorrelation = 'spearmanCorrelation',
  /** 统计极值和占比贡献巨大值 */
  ExtremeValue = 'extremeValue',
  MajorityValue = 'majorityValue',
  /** zScore 全局异常点检测和IQR (Interquartile Range) 四分位全局异常检测算法 为主的统计学方法 */
  StatisticsAbnormal = 'statisticsAbnormal',
  /** 基础指标，包括最大，最小，平均值 */
  StatisticsBase = 'statisticsBase',
  /** 以DBSCAN为主的离群点检测算法 */
  DbscanOutlier = 'dbscanOutlier',
  /** LOF(Local Outlier Factor) 局部异常因子检测算法 */
  LOFOutlier = 'lofOutlier',
  /** Bayesian Inference 转折点检测算法 */
  TurningPoint = 'turningPoint',
  /** Page-Hinkley Test 时序数据异常检测算法 */
  PageHinkley = 'pageHinkley',
  /** Coefficient of Variation 基于变异系数的周期性检测 */
  Volatility = 'volatility'
}
```

### 默认值
默认VMind会开启`isLimitedbyChartType`以及`usePolish`，同时默认开启所有算法

## 返回值类型
返回值`insight`为洞察数组，单个洞察类型如下所示：
```ts
export interface Insight {
  /** 洞察名称 */
  name: string;
  /** 洞察类型 */
  type: InsightType;
  /** 洞察对应的具体数据 */
  data: {
    /** index编号 */
    index: number;
    /** 具体数据项 */
    dataItem: DataItem;
  }[];
  /** 异常点对应的数据字段id，例如为销售额。增长率等 */
  fieldId?: string;
  /** 具体的图元系列名称，例如可能是"东北" ｜ "苹果"等具体的分类数据名称 */
  seriesName?: DataCell | DataCell[];
  /** 语义化数据表达，包含占位符 */
  textContent?: {
    // 原始文本内容
    content: string;
    // 将变量占位符解析为文本后的纯文本
    plainText: string;
    // 变量的映射
    variables?: Record<string, InsightTextContent>;
  }; 
  // 洞察的具体值
  value?: number | string;
  /** 洞察的置信度的粉，用于洞察排序，分数越高代表洞察越重要 */
  significant: number;
  info?: { [key: string]: any }; // 关于此洞察的附加信息
}

export interface InsightTextContent {
  /** 解析值 */
  value: DataCell;
  /** 格式化后的值 */
  formatValue?: string; // 格式化后的值
  /** 字段名称 */
  fieldName: string; 
  /** 当前颜色 */
  color?: string;
  /** 值的类型，例如上升趋势或下降趋势 */
  valueType?: 'ascendTrend' | 'descendTrend' | string;
  /** 图标类型，例如比率、上升趋势或下降趋势 */
  icon?: 'ratio' | 'ascendTrend' | 'descendTrend' | string;
  /** 是否为度量值 */
  isMeasure?: boolean;
  /** 是否为维度值 */
  isDimValue?: boolean;
}
```

### 具体案例和相关教程
[智能洞察](../guide/Basic_Tutorial/Chart_Insight)
