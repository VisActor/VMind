# Intelligent Insights

In the era of data-driven decision-making, charts serve as a core tool for data visualization, providing an intuitive way to present complex data relationships. However, relying solely on human observation and analysis of charts often makes it difficult to quickly and comprehensively uncover the hidden insights behind the data.

This tutorial will introduce you to the intelligent insights feature in VMind, demonstrating how to quickly obtain various types of insights from charts using the `getInsights` function, along with some examples.

## getInsights

The `getInsights` function in VMind is a powerful tool that helps you extract chart insights and generate semantic explanations. This function requires the following two parameters:
- spec: The specific spec configuration of the current VChart chart
- options (DataInsightOptions): Insight-related configurations that control the number of specific insights, the algorithms used, and the specific configurations of the corresponding algorithms

During the process of generating intelligent insights, VMind primarily performs two tasks:
- First, it uses built-in statistical algorithms to extract data insights contained in the current chart;
- Then, these identified insights are passed to a large model, which polishes and semantically explains these insights. During the polishing process, VMind passes field information and insight types to the large model but **does not pass any data details to the large model**.

The second step of polishing by the large model is not mandatory and can be disabled through `options.usePolish`, in which case you will receive data insights and templated semantic content.

### Built-in Algorithms

Currently, VMind's built-in algorithms are primarily related to statistics, as listed below:
- LOF (Local Outlier Factor) for local outlier detection
- zScore for global outlier detection
- IQR (Interquartile Range) for global outlier detection
- Page-Hinkley Test for time series anomaly detection
- Bayesian Inference for change point detection
- Mann-Kendall Test for trend detection
- Pearson Correlation Coefficient / Spearman Correlation for correlation detection
- DBSCAN (Density-Based Spatial Clustering of Applications with Noise) algorithm
- Coefficient of Variation for periodicity detection based on the coefficient of variation
- Basic statistical indicators, such as maximum/minimum/average value/proportion anomalies, etc.

### Large Model Polishing

In intelligent insights, the large model serves only as a text polishing function, enhancing the readability of the final results, and is an optional configuration.

## Insight Types

Based on the existing built-in algorithms, VMind can identify the following 9 types of insights:
- Outliers
- Time series outliers
- Change points
- Points with significant contribution to proportion
- Anomalous intervals
- Overall trends
- Anomalous trends
- Correlations
- Basic statistical indicators

Depending on different insight results, users can choose different annotation/highlighting methods to present them in charts.

## Usage Example

Below is an example of using `getInsights`:
```ts
import VMind from '@visactor/vmind';

const specJson = {
    type: 'line',
    xField: ['Year'],
    yField: ['College Admission Rate'],
    data: [
      {
        id: 'data',
        values: [
          {"Year": 1977, "College Admission Rate": 0.05},
          {"Year": 1978, "College Admission Rate": 0.07},
          {"Year": 1979, "College Admission Rate": 0.06},
          {"Year": 1980, "College Admission Rate": 0.08},
          {"Year": 1981, "College Admission Rate": 0.11},
          {"Year": 1982, "College Admission Rate": 0.17},
          {"Year": 1983, "College Admission Rate": 0.23},
          {"Year": 1984, "College Admission Rate": 0.29},
          {"Year": 1985, "College Admission Rate": 0.96},
          {"Year": 1986, "College Admission Rate": 0.3},
          {"Year": 1987, "College Admission Rate": 0.27},
          {"Year": 1988, "College Admission Rate": 0.25},
          {"Year": 1989, "College Admission Rate": 0.23},
          {"Year": 1990, "College Admission Rate": 0.22},
          {"Year": 1991, "College Admission Rate": 0.21},
          {"Year": 1992, "College Admission Rate": 0.25},
          {"Year": 1993, "College Admission Rate": 0.34},
          {"Year": 1994, "College Admission Rate": 0.36},
          {"Year": 1995, "College Admission Rate": 0.37},
          {"Year": 1996, "College Admission Rate": 0.4},
          {"Year": 1997, "College Admission Rate": 0.36},
          {"Year": 1998, "College Admission Rate": 0.34},
          {"Year": 1999, "College Admission Rate": 0.56},
          {"Year": 2000, "College Admission Rate": 0.59},
          {"Year": 2001, "College Admission Rate": 0.59},
          {"Year": 2002, "College Admission Rate": 0.63},
          {"Year": 2003, "College Admission Rate": 0.62},
          {"Year": 2004, "College Admission Rate": 0.61},
          {"Year": 2005, "College Admission Rate": 0.57},
          {"Year": 2006, "College Admission Rate": 0.57},
          {"Year": 2007, "College Admission Rate": 0.56},
          {"Year": 2008, "College Admission Rate": 0.57},
          {"Year": 2009, "College Admission Rate": 0.62},
          {"Year": 2010, "College Admission Rate": 0.69},
          {"Year": 2011, "College Admission Rate": 0.72},
          {"Year": 2012, "College Admission Rate": 0.75},
          {"Year": 2013, "College Admission Rate": 0.75},
          {"Year": 2014, "College Admission Rate": 0.74},
          {"Year": 2015, "College Admission Rate": 0.74},
          {"Year": 2016, "College Admission Rate": 0.75},
          {"Year": 2017, "College Admission Rate": 0.74},
          {"Year": 2018, "College Admission Rate": 0.81},
          {"Year": 2019, "College Admission Rate": 0.8},
          {"Year": 2020, "College Admission Rate": 0.8},
          {"Year": 2021, "College Admission Rate": 0.93},
          {"Year": 2022, "College Admission Rate": 0.96}
      ]
      }
    ]
  };
const vmind = new VMind(options)
const { insights } = await vmind.getInsights(specJson, {
  /** Generate up to maxNum insights */
  maxNum: numLimits,
});
```

The final result accurately identifies the overall trend and the significantly anomalous college admission rate in 1985.

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind_insight_en_1.jpeg)
### Return Structure

Taking the overall trend as an example, the structured content returned is as follows:
```ts
const outlierInsight = {
  /** Type is outlier Insight */
  type: 'outlier',
  /** Specific outlier data */
  data: [
    {
      index: 8,
      dataItem: {
        Year: 1985,
        College Admission Rate: 0.96,
      }
    }
  ],
  /** Numerical field */
  fieldId: 'College Admission Rate',
  /** Current outlier value */
  value: 0.96,
  /** Insight confidence score */
  significant: 1,
  /** Current series name, since the current chart does not have a seriesField configuration, it only contains one series, so it is the default value of vmind */
  seriesName: 'vmind_default_series',
  /** Detected by the pageHinkley algorithm */
  name: 'pageHinkley',
  /** Specific textual meaning */
  textContent: {
    /** Specific text template */
    content: '${b} period shows a significant anomaly, with a value of ${c}.',
    /** Variable parsing in the template */
    variables: {
      b: {
        isDimValue: true,
        value: 1985,
        fieldName: 'Year'
      },
      c: {
        value: 0.96,
        isMeasure: true,
        fieldName: 'College Admission Rate'
      }
    },
    /** Result of directly replacing template variables with values */
    plainText: '1985 period shows a significant anomaly, with a value of 0.96.'
  }
}
```

### Adding Insights

After identifying chart insights, we can use VChart's powerful annotation capabilities to add these contents to the chart, as shown in the final effect below:
![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind_insight_en_2.jpeg)

## Parameter Details

For detailed parameter explanations, see: [getInsights](../../api/getInsights)