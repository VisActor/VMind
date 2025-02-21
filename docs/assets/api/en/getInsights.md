# getInsights

## Interface Description

The getInsights interface generates insights for the current chart based on the VChart Spec configuration and insight options. The final insights are sorted in descending order of confidence scores.

## Interface Parameters

```typescript
getInsights(spec: any, options?: DataInsightOptions): { insights: Insights[], usage: Usage };

export interface DataInsightOptions {
  /** Maximum number of insights to generate */
  maxNum?: number;
  /** Maximum number of insights for each specific insight type, which takes precedence over maxNum */
  detailMaxNum?: {
    types: InsightType[];
    maxNum: number;
  }[];
  /** Algorithms to use */
  algorithms?: AlgorithmType[];
  /** Hyperparameter settings for each algorithm */
  algorithmOptions?: AlgorithmOptions;
  /** Whether to consider chart type for insight results, e.g., clustering algorithms are only used in scatter plots */
  isLimitedbyChartType?: boolean;
  /** Whether to use a large model for text polishing */
  usePolish?: boolean;
  /** answer language */
  language?: 'chinese' | 'english';
}
```

### Insight Types
The specific insight types are as follows, comprising 12 types in total.
```ts
export enum InsightType {
  /** Minimum value */
  Min = 'min',
  /** Maximum value */
  Max = 'max',
  /** Average value */
  Avg = 'avg',
  /** Outlier */
  Outlier = 'outlier',
  /** Extreme value */
  ExtremeValue = 'extreme_value',
  /** Majority value with significant contribution */
  MajorityValue = 'majority_value',
  /** Turning point */
  TurningPoint = 'turning_point',
  /** Overall trend */
  OverallTrend = 'overall_trend',
  /** Abnormal trend */
  AbnormalTrend = 'abnormal_trend',
  /** Abnormal band */
  AbnormalBand = 'abnormal_band',
  /** Correlation */
  Correlation = 'correlation',
  /** Volatility */
  Volatility = 'volatility'
}
```

### Built-in Algorithms
All built-in algorithms in VMind are as follows:
```ts
export enum AlgorithmType {
  /** Overall/abnormal trend, using Mann-Kendall Test for trend detection */
  OverallTrending = 'overallTrend',
  AbnormalTrend = 'abnormalTrend',
  /** Pearson Correlation Coefficient / Spearman Correlation for correlation detection */
  PearsonCorrelation = 'pearsonCorrelation',
  SpearmanCorrelation = 'spearmanCorrelation',
  /** Statistical extreme values and majority values */
  ExtremeValue = 'extremeValue',
  MajorityValue = 'majorityValue',
  /** zScore global outlier detection and IQR (Interquartile Range) global outlier detection algorithms as the main statistical methods */
  StatisticsAbnormal = 'statisticsAbnormal',
  /** Basic indicators, including maximum, minimum, average values */
  StatisticsBase = 'statisticsBase',
  /** DBSCAN-based outlier detection algorithm */
  DbscanOutlier = 'dbscanOutlier',
  /** LOF (Local Outlier Factor) local outlier factor detection algorithm */
  LOFOutlier = 'lofOutlier',
  /** Bayesian Inference turning point detection algorithm */
  TurningPoint = 'turningPoint',
  /** Page-Hinkley Test for time series anomaly detection */
  PageHinkley = 'pageHinkley',
  /** Coefficient of Variation for periodicity detection based on the coefficient of variation */
  Volatility = 'volatility'
}
```

### Default Values
By default, VMind enables `isLimitedbyChartType` and `usePolish`, and all algorithms are enabled by default.

## Return Value Type
The return value `insight` is an array of insights, with a single insight type as follows:
```ts
export interface Insight {
  /** Insight name */
  name: string;
  /** Insight type */
  type: InsightType;
  /** Specific data corresponding to the insight */
  data: {
    /** Index number */
    index: number;
    /** Specific data item */
    dataItem: DataItem;
  }[];
  /** Data field ID corresponding to the outlier, e.g., sales, growth rate, etc. */
  fieldId?: string;
  /** Specific series name, e.g., "Northeast" | "Apple" or other specific category data names */
  seriesName?: DataCell | DataCell[];
  /** Semantic data expression, including placeholders */
  textContent?: {
    // Original text content
    content: string;
    // Plain text after parsing variable placeholders
    plainText: string;
    // Mapping of variables
    variables?: Record<string, InsightTextContent>;
  }; 
  // Specific value of the insight
  value?: number | string;
  /** Confidence score of the insight, used for insight sorting, the higher the score, the more important the insight */
  significant: number;
  info?: { [key: string]: any }; // Additional information about this insight
}

export interface InsightTextContent {
  /** Parsed value */
  value: DataCell;
  /** Formatted value */
  formatValue?: string; // Formatted value
  /** Field name */
  fieldName: string; 
  /** Current color */
  color?: string;
  /** Type of value, e.g., ascending trend or descending trend */
  valueType?: 'ascendTrend' | 'descendTrend' | string;
  /** Icon type, e.g., ratio, ascending trend, or descending trend */
  icon?: 'ratio' | 'ascendTrend' | 'descendTrend' | string;
  /** Whether it is a measure value */
  isMeasure?: boolean;
  /** Whether it is a dimension value */
  isDimValue?: boolean;
}
```

### Specific Examples and Related Tutorials
[Intelligent Insights](../guide/Basic_Tutorial/Chart_Insight)
