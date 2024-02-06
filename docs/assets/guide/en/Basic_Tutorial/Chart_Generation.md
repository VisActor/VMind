# Chart Generation
📢 Note: The chart generation feature currently supports OpenAI GPT-3.5, GPT-4 series models, and Volcano Engine [Skylark-pro](https://www.volcengine.com/product/yunque) series models. We will continue to expand the range of supported models. If you have any requirements, feel free to propose them on our [Github page](https://github.com/VisActor/VMind/issues/new/choose).

This tutorial will provide you with a detailed introduction to the intelligent chart generation feature in VMind and provide some examples.

There are many ways to generate charts, such as using professional BI visualization tools like PowerBI, Tableau, etc., to create visual charts using the fields of datasets; or you can directly use chart libraries like VChart, ECharts, MatPlotlib, etc., to draw charts by writing code. In addition, chart libraries like VChart, Echarts also provide simple and easy-to-use chart editors, where users can upload data and create charts.

However, traditional chart generation methods also have some problems:

- For programming beginners, they may not know how to write code, so they cannot use chart libraries to generate charts.
- There are many types of charts, and the purpose of users' data display varies, which leads to different suitable chart types and corresponding field mappings. For non-professional users, they may not be able to accurately choose the chart type that best expresses their views.
![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_chart_generation.png)
- Users have different requirements for chart styles and animations, which often require certain design capabilities to meet. Designing a stunning chart is not easy, it requires design skills and aesthetic sense, which many users lack.

These problems increase the threshold of data visualization creation and hinder non-professional users from creating visual works that meet their intentions.

VMind's solution is to use the natural language understanding ability and public domain knowledge of large language models, recommend suitable chart types according to the user's data and display intentions, and map the fields to the appropriate visual channels to achieve intelligent chart generation, thereby reducing the threshold for users to perform data visualization.


## generateChart
VMind's generateChart function is a powerful tool that can help you intelligently generate charts. This function requires the following parameters:
- userPrompt: User's visualization intention (what information you want to display with the chart)
- fieldInfo: Information about the fields in the dataset, including field names, types, etc.
- dataset: The dataset used for the chart
- enableDataQuery: Optional parameter, decide whether to enable data aggregation during chart generation
- colorPalette: Optional parameter, used to set the chart's color palette
- animationDuration: Optional parameter, used to set the duration of the chart animation

This method will return a [VChart chart spec](https://www.visactor.io/vchart/guide/tutorial_docs/Basic/A_Basic_Spec).

📢 **Please note: The generateChart method will pass userPrompt and fieldInfo to the large language model for chart generation, but the detailed data in the dataset will not be passed.**

In the process of generating the chart, VMind will first use the large language model, recommend a suitable chart type based on userPrompt and fieldInfo. Then, it will map the fields in fieldInfo to the visual channels of the chart, such as the x-axis, y-axis, color, size, etc.

VMind will add an entrance animation to the generated chart by default, so it will also return the duration of the chart animation time. If you don't want the chart animation, you can set spec.animation to false.

You can learn more about chart animations in the [VChart animation tutorial](https://www.visactor.io/vchart/guide/tutorial_docs/Animation/Animation_Types).

Here is an example of using generateChart to generate a chart:
```ts
import VMind from '@visactor/vmind';

const vmind = new VMind(options)
const userPrompt = 'show me the changes in sales rankings of various car brand';
const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset);
```
You can learn how to create a VMind instance and the information of the parameters in options in [Creating a VMind Instance](./Create_VMind_Instance.md), and get more information about fieldInfo and dataset in the [Data Format and Data Processing](./Data_Process.md) section.

You can reprocess the spec to change the color, style, animation, etc. of the chart, or you can directly render the VChart chart:

```html
<body>
<!-- Prepare a DOM with size (width and height) for vchart, of course you can also specify it in the spec configuration -->
<div id="chart" style="width: 600px;height:400px;"></div>
</body>
```
```ts
import VChart from '@visactor/vchart';

// Create vchart instance
const vchart = new VChart(spec, { dom: 'chart' });
// Render Chart
vchart.renderSync();
```

In userPrompt, you can describe what you want to show, which will be used as the basis for the large language model to recommend chart types; you can also pass in a color string array through colorPalette, which will be used as the color theme of the chart.


## Parameter Explanation
### userPrompt
The `userPrompt` parameter is used to describe the content you want to display with the dataset. This description will be passed to the large language model as a reference when generating the chart.

For example, suppose we have a mobile phone brand sales dataset, as shown below:
```json
[
  {
    "Brand Name": "Apple",
    "Market Share": 0.5,
    "Average Price": 7068,
    "Net Profit": 314531
  },
  {
    "Brand Name": "Samsung",
    "Market Share": 0.2,
    "Average Price": 6059,
    "Net Profit": 362345
  },
  {
    "Brand Name": "Vivo",
    "Market Share": 0.05,
    "Average Price": 3406,
    "Net Profit": 234512
  },
  {
    "Brand Name": "Nokia",
    "Market Share": 0.01,
    "Average Price": 1064,
    "Net Profit": -1345
  },
  {
    "Brand Name": "Xiaomi",
    "Market Share": 0.1,
    "Average Price": 4087,
    "Net Profit": 131345
  }
]
```
You can set `userPrompt` to `Show the market share of each brand`, and then call the `generateChart` method, which will generate a pie chart:

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_pie.png)


You can also set `userPrompt` to `Show the net profit of each brand`, and the generated chart will show the net profit of each brand:

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_column.png)


You can even specify the chart type, such as setting `userPrompt` to `Show the net profit of each brand, with a line chart`, and the generated chart will be a line chart:

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_line.png)


You can even specify the mapping of the chart's visual channels, such as setting `userPrompt` to `Use the average price as the x-axis, net profit as the y-axis, brand name as the color, market share as the size of the point, and draw a scatter plot`:

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_scatter.png)


The power of VMind is that you can generate the chart you want by simply describing your needs in a sentence, without worrying about the details of chart generation. This is thanks to the public knowledge mastered by the large language model.

For example, for the following csv data:
```json
Time,Male-Breakfast,Female-Breakfast
Monday,15,22
Tuesday,12,10
Wednesday,15,20
Thursday,10,12
Friday,13,15
Saturday,10,15
Sunday,12,14
```

If your display intention is `Show the difference in breakfast quantity between men and women`, then a dual-axis chart will be generated:

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_dual_axis.png)


VMind also supports [dynamic bar charts (ranking bar)](https://www.visactor.io/vchart/demo/storytelling/ranking-bar), which is a narrative chart that shows the changes in the rankings of different types of data at different time points through constantly changing bar charts. To generate a dynamic bar chart, there must be a time field in the data.

For example, we have the following dataset and field information:
```json
[
{
"country": "USA",
"continent": "North America",
"GDP": 239270,
"year": 1973
},
{
"country": "India",
"continent": "Asia",
"GDP": 22960,
"year": 1973
},
{
"country": "South Korea",
"continent": "Asia",
"GDP": 7870,
"year": 1973
},
{
"country": "Indonesia",
"continent": "Asia",
"GDP": 10980,
"year": 1973
},
{
"country": "Saudi Arabia",
"continent": "Asia",
"GDP": 23760,
"year": 1973
},
{
"country": "Thailand",
"continent": "Asia",
"GDP": 4130,
"year": 1973
},
{
"country": "Philippines",
"continent": "Asia",
"GDP": 5660,
"year": 1974
},
{
"country": "Malaysia",
"continent": "Asia",
"GDP": 2780,
"year": 1974
},
{
"country": "United Kingdom",
"continent": "Europe",
"GDP": 114750,
"year": 1974,
}
...... //For the complete dataset, please see the packages/vmind/__tests__/browser/src/constants/mockData.ts file in the VMind repository
]
```
```json
[
  {
    "fieldName": "country",
    "type": "string",
    "role": "dimension"
  },
  {
    "fieldName": "continent",
    "type": "string",
    "role": "dimension"
  },
  {
    "fieldName": "GDP",
    "type": "float",
    "role": "measure"
  },
  {
    "fieldName": "year",
    "type": "date",
    "role": "measure"
  }
]
```

If `userPrompt` is `Show me the change of the GDP rankings of each country`, then a dynamic bar chart will be generated:
![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_dynamic_bar.gif)


To make VMind generate a chart that meets your expectations, you need to describe your display intention and purpose as clearly as possible in `userPrompt`. In addition, you need to ensure that the field names in the dataset have certain semantics, or add field descriptions in the field information, please refer to the [Data Format and Data Processing](./Data_Process.md) chapter for details.


### enableDataQuery
In the [Data Aggregation](./Data_Aggregation.md) chapter, we have introduced that in order to meet the chart display requirements such as `showing the top 10 departments with the most sales` or `showing the sales of various products in the northern region`, we need to aggregate the data first, and then generate the chart. By default, the `generateChart` function will call `dataQuery` once during execution, using the same `userPrompt`, `fieldInfo` and `dataset` to aggregate the data, and then complete the subsequent chart generation steps with the aggregated data.

However, if you are sure that your data can meet the user's chart display requirements without further aggregation, filtering and sorting, you can turn off this process by setting `enableDataQuery` to `false`:
```ts
import VMind from '@visactor/vmind';

const vmind = new VMind(options)
const userPrompt = 'show me the changes in sales rankings of various car brand';
const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset, false); // Set enableDataQuery to false to turn off data aggregation
```
This can reduce the process of calling the large model once, reduce token consumption, and improve chart generation speed. For more information about VMind data aggregation, please refer to the [Data Aggregation](./Data_Aggregation.md) chapter.

## Chart Types Supported by VMind
VMind currently supports 13 common chart types in VChart:
- [Bar Chart](https://www.visactor.io/vchart/demo/bar-chart/basic-column)
- [Line Chart](hhttps://www.visactor.io/vchart/demo/line-chart/basic-line)
- [Pie Chart](https://www.visactor.io/vchart/demo/pie-chart/basic-pie)
- [Scatter Chart](https://www.visactor.io/vchart/demo/scatter-chart/basic-scatter)
- [Dual Axis Chart](https://www.visactor.io/vchart/demo/combination/dual-axis)
- [Word Cloud](https://www.visactor.io/vchart/demo/word-cloud-chart/word-cloud-basic)
- [Rose Chart](https://www.visactor.io/vchart/demo/rose-chart/basic-rose)
- [Radar Chart](https://www.visactor.io/vchart/demo/radar-chart/basic-radar)
- [Box Plot](https://www.visactor.io/vchart/demo/box-plot/basic-box-plot)
- [Funnel Chart](https://www.visactor.io/vchart/demo/funnel-chart/basic-funnel)
- [Sankey Chart](https://www.visactor.io/vchart/demo/sankey-chart/basic-sankey)
- [Waterfall Chart](https://www.visactor.io/vchart/demo/waterfall/basic-waterfall)
- [Dynamic Bar Chart (ranking bar)](https://www.visactor.io/vchart/demo/storytelling/ranking-bar)

Depending on the `userPrompt` and `fieldInfo`, these chart types may all be recommended by the large language model.

If you have new chart type requirements, feel free to propose them on our [Github page](https://github.com/VisActor/VMind/issues/new/choose).
