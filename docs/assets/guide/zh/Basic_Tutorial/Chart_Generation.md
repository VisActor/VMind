# 图表生成
📢 提示：图表生成功能目前支持OpenAI GPT-3.5，GPT-4 系列模型和火山引擎[云雀（skylark-pro）](https://www.volcengine.com/product/yunque)系列模型。我们将不断扩大支持的模型范围，如果你有任何需求，欢迎在我们的[Github页面](https://github.com/VisActor/VMind/issues/new/choose)提出。

本教程将向你详细介绍VMind中的图表智能生成功能，并提供一些示例。

生成图表的方式有很多，比如你可以在PowerBI、Tableau等专业的BI可视化工具中，利用数据集的字段来制作可视化图表；或者你也可以直接使用VChart、ECharts、MatPlotlib等图表库，通过编写代码来绘制图表。此外，VChart、Echarts等图表库还提供了简单易用的图表编辑器，用户可以上传数据并进行图表制作。

然而，传统的图表生成方式也存在一些问题：

- 对于编程新手来说，他们可能不会编写代码，也就无法使用图表库来生成图表。
- 图表类型繁多，用户展示数据的目的各不相同，这就导致了适合展示的图表类型和对应的字段映射也会有所不同。对于非专业用户来说，他们可能无法准确地选择出最能表达自己观点的图表类型。
![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_chart_generation.png)
- 用户对于图表样式、动画的需求各不相同，往往需要一定的设计能力才能满足。设计出令人眼前一亮的图表并不容易，它需要设计技能和审美意识，而这些是许多用户所缺乏的。

这些问题增加了数据可视化的创作门槛，阻碍了非专业用户创作符合自己意图的可视化作品。

VMind的解决方案是，利用大语言模型的自然语言理解能力和公域知识，根据用户的数据和展示意图，推荐合适的图表类型，并将字段映射到合适的视觉通道上，实现图表的智能生成，从而降低用户进行数据可视化的门槛。


## generateChart
VMind的generateChart函数是一个强大的工具，它可以帮助你智能生成图表。这个函数需要以下几个参数：
- userPrompt (string): 用户的可视化意图（你想用图表展示什么信息）
- fieldInfo (Array): 数据集中字段的信息，包括字段名称，类型等
- dataset (Array): 图表中使用的原始数据集，可以是undefined。若dataset为undefined，则会生成一个spec模板，后续可以调用fillSpecTemplateWithData将数据填充到spec模板。
- options: 可选，选项参数，包括以下内容：

  - chartTypeList (ChartType[]，可选): 支持的图表类型列表。若不为undefined，则会从该列表指定的图表类型中选择生成。
  - enableDataQuery (boolean, 可选): 决定是否在图表生成过程中开启数据聚合
  - colorPalette (Array<string>, 可选): 用于设置图表的调色板
  - animationDuration (number, 可选): 用于设置图表动画的播放持续时间

这个方法会返回一个[VChart图表spec](https://www.visactor.io/vchart/guide/tutorial_docs/Basic/A_Basic_Spec)。

📢 **请注意：generateChart方法会将userPrompt和fieldInfo传递给大语言模型用于生成图表，但是dataset中的详细数据并不会被传递。**

在生成图表的过程中，VMind首先会利用大语言模型，根据userPrompt和fieldInfo，推荐一个适合的图表类型。然后，它会将fieldInfo中的字段映射到图表的x轴、y轴、颜色、尺寸等视觉通道上。

VMind默认会为生成的图表添加入场动画，因此它还会返回图表动画的时长time。如果你不想要图表动画，可以将spec.animation设为false。

你可以在[VChart动画教程](https://www.visactor.io/vchart/guide/tutorial_docs/Animation/Animation_Types)中了解更多关于图表动画的信息。

下面是一个使用generateChart生成图表的例子：
```ts
import VMind from '@visactor/vmind';

const vmind = new VMind(options)
const userPrompt = 'show me the changes in sales rankings of various car brand';
const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset);
```
你可以在[创建VMind实例](./Create_VMind_Instance)中了解如何创建VMind实例和options中的参数信息，在[数据格式与数据处理](./Data_Process)章节中获取更多关于fieldInfo和dataset的相关信息。

你可以对spec进行二次加工，改变图表的颜色、样式、动画等配置，也可以直接渲染VChart图表：

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

在userPrompt中，你可以描述你想展示的内容，这将作为大语言模型推荐图表类型时的依据；你也可以通过options.colorPalette传入一个颜色字符串数组，它将被用作图表的颜色主题。



## 参数详解
### userPrompt
`userPrompt`参数是你用来描述你想要用数据集展示的内容，这个描述会被传递给大语言模型，作为生成图表时的参考依据。

举个例子，假设我们有一个手机品牌销售数据集，如下所示：
```json
[
    {
        "品牌名称": "Apple",
        "市场份额": 0.5,
        "平均价格": 7068,
        "净利润": 314531
    },
    {
        "品牌名称": "Samsung",
        "市场份额": 0.2,
        "平均价格": 6059,
        "净利润": 362345
    },
    {
        "品牌名称": "Vivo",
        "市场份额": 0.05,
        "平均价格": 3406,
        "净利润": 234512
    },
    {
        "品牌名称": "Nokia",
        "市场份额": 0.01,
        "平均价格": 1064,
        "净利润": -1345
    },
    {
        "品牌名称": "Xiaomi",
        "市场份额": 0.1,
        "平均价格": 4087,
        "净利润": 131345
    }
]
```
你可以将`userPrompt`设置为`展示各品牌市场占有率`，然后调用`generateChart`方法，这样就会生成一个饼图：

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_pie.png)


你也可以设置`userPrompt`为`展示各品牌的净利润`，这样生成的图表就会展示各品牌的净利润情况：

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_column.png)


你还可以指定图表类型，比如设置`userPrompt`为`展示各品牌的净利润，用折线图`，这样生成的图表就会是一个折线图：

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_line.png)


你甚至可以指定图表视觉通道的映射，例如设置`userPrompt`为`使用平均价格做x轴，净利润做y轴，品牌名称用作颜色，市场份额做点的大小，绘制散点图`：

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_scatter.png)


VMind的强大之处在于，你只需要用一句话描述你的需求，就可以生成你想要的图表，而无需关心图表生成的细节。这得益于大语言模型所掌握的公域知识。

例如，对于下面这份csv数据：
```json
时间,男-早餐,女-早餐
周一,15,22
周二,12,10
周三,15,20
周四,10,12
周五,13,15
周六,10,15
周日,12,14
```

如果你输入的展示意图为`展示男女早餐饭量不同`，那么就会生成一个双轴图：

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_dual_axis.png)


VMind还支持[动态条形图（ranking bar）](https://www.visactor.io/vchart/demo/storytelling/ranking-bar)，这是一种叙事图表，它通过不断变化的柱状图展示不同时间节点不同种类的数据在排名上的变化。为了生成一个动态条形图，数据中必须有一个时间字段。

例如，我们有下面的数据集和字段信息：
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
    ...... //完整数据集请见VMind仓库中的packages/vmind/__tests__/browser/src/constants/mockData.ts文件
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

如果`userPrompt`为`Show me the change of the GDP rankings of each country`，那么就会生成一个动态条形图：
![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_dynamic_bar.gif)


为了让VMind生成符合预期的图表，你需要在`userPrompt`中尽可能清晰地描述你的展示意图和目的。此外，你还需要确保数据集的字段名称具有一定的语义，或者在字段信息中添加字段描述，具体请参见[数据格式与数据处理](./Data_Process)章节。

### options
#### enableDataQuery: 是否开启智能数据聚合
在[数据聚合](./Data_Aggregation)章节中，我们已经介绍过，为了满足`展示销售额最多的10个部门`或`展示北方区域各商品的销售额`等图表展示需求，我们需要先对数据进行聚合，然后再生成图表。在默认情况下，`generateChart`函数会在执行过程中调用一次`dataQuery`，使用相同的`userPrompt`，`fieldInfo`和`dataset`对数据进行聚合，然后使用聚合后的数据完成后续的图表生成步骤。

然而，如果你确定你的数据无需进行进一步的聚合、筛选和排序就可以满足用户的图表展示需求，你可以通过将`enableDataQuery`设置为`false`来关闭这一流程：
```ts
import VMind from '@visactor/vmind';

const vmind = new VMind(options)
const userPrompt = 'show me the changes in sales rankings of various car brand';
const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset, {enableDataQuery: false}); //将enableDataQuery设置为false，关闭数据聚合
```
这样做可以减少一次调用大模型的过程，降低token消耗，提高图表生成速度。关于VMind数据聚合的更多信息，请参考[数据聚合](./Data_Aggregation)章节。

#### chartTypeList: 限制VMind生成的图表类型
VMind目前支持VChart中常见的13种图表类型：
- [柱状图](https://www.visactor.io/vchart/demo/bar-chart/basic-column)
- [折线图](hhttps://www.visactor.io/vchart/demo/line-chart/basic-line)
- [饼图](https://www.visactor.io/vchart/demo/pie-chart/basic-pie)
- [散点图](https://www.visactor.io/vchart/demo/scatter-chart/basic-scatter)
- [双轴图](https://www.visactor.io/vchart/demo/combination/dual-axis)
- [词云](https://www.visactor.io/vchart/demo/word-cloud-chart/word-cloud-basic)
- [玫瑰图](https://www.visactor.io/vchart/demo/rose-chart/basic-rose)
- [雷达图](https://www.visactor.io/vchart/demo/radar-chart/basic-radar)
- [箱型图](https://www.visactor.io/vchart/demo/box-plot/basic-box-plot)
- [漏斗图](https://www.visactor.io/vchart/demo/funnel-chart/basic-funnel)
- [桑基图](https://www.visactor.io/vchart/demo/sankey-chart/basic-sankey)
- [瀑布图](https://www.visactor.io/vchart/demo/waterfall/basic-waterfall)
- [动态条形图（ranking bar）](https://www.visactor.io/vchart/demo/storytelling/ranking-bar)

根据`userPrompt`和`fieldInfo`的不同，这些图表类型都有可能被大语言模型推荐。
如果你有新的图表类型需求，欢迎在我们的[Github页面](https://github.com/VisActor/VMind/issues/new/choose)提出。

如果你想限制VMind在图表智能生成中生成的图表类型，可以通过设置options.chartTypeList数组：
```typescript
import VMind, { ChartType } from '@visactor/vmind';

//限制生成以下几种图表类型：柱状图，折线图，散点图，饼图，词云
const chartTypeList = [
  ChartType.BarChart,
  ChartType.LineChart,
  ChartType.ScatterPlot,
  ChartType.PieChart,
  ChartType.WordCloud
  ]

const { spec } = await vmind.generateChart(userPrompt, fieldInfo, dataset, {chartTypeList});
```
在上面的例子中，VMind将会在柱状图，折线图，散点图，饼图，词云中选择图表类型进行生成。若用户在userPrompt强行指定了不支持的图表类型，将会抛出错误。

#### colorPalette: 设置图表色板
可以通过将options.colorPalette设置为一个颜色数组来指定图表所使用的色板:
```typescript
//设置自定义色板
const colorPalette = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

const { spec } = await vmind.generateChart(userPrompt, fieldInfo, dataset, {colorPalette});
```
同时，VMind还内置了[Arco-design](https://www.visactor.io/vchart/theme/demo/arco)，[Semi-design](https://www.visactor.io/vchart/theme/demo/semi)，[源力设计](https://www.visactor.io/vchart/theme/demo/arco)等多套主题色板：
```typescript
import VMind, {ArcoTheme} from '@visactor/vmind';

//使用Arco-design色板
const {spec} = await vmind.generateChart(describe, finalFieldInfo, finalDataset, {
  colorPalette: ArcoTheme.colorScheme
});
```

```typescript
import VMind, { VeOThemeFinance } from '@visactor/vmind';

//使用源力设计-金融行业主题色板
const {spec} = await vmind.generateChart(describe, finalFieldInfo, finalDataset, {
  colorPalette: VeOThemeFinance.colorScheme
});
```
更多主题色板参见[图表智能生成API](../../api/generateChart)


## 返回值详解
vmind.generateChart方法返回值类型定义如下：

```typescript
interface GenerateChartResult {
  spec: Record<string, any>;
  chartType: Record<string, string | string[]>;
  cell: Cell;
  chartSource: string;
  usage: any;
  time: {
    totalTime : number;
    frameArr: number[];
  };
}
```

### spec
生成的VChart图表spec。若dataset为空，则为不包含数据的spec模板

### chartType
生成的图表类型，参见本教程的`chartTypeList: 限制VMind生成的图表类型`章节

### cell
图表中的字段映射，描述数据集中的字段如何映射到图表的各个视觉通道上。视觉通道（Visual Channel）是数据可视化中的一个重要概念，用于描述如何将数据的属性映射到视觉元素，以便人类直观理解。常见的视觉通道包括颜色、形状、大小、方位、位置等。例如，通过视觉通道，我们可以将数据集中的不同类别映射到不同颜色的图形，或者将数值大小映射到图形的大小，从而帮助我们快速理解数据的特性和分布。

下面展示一个图表生成的例子：
```typescript
import VMind from '@visactor/vmind';

const vmind = new VMind(options)

const userPrompt = '展示不同地区商品销售额';
const fieldInfo=[
    {
        "fieldName": "商品名称",
        "type": "string",
        "role": "dimension",
        "domain": [
            "可乐",
            "雪碧",
            "芬达",
            "醒目"
        ]
    },
    {
        "fieldName": "region",
        "type": "string",
        "role": "dimension",
        "domain": [
            "south",
            "east",
            "west",
            "north"
        ]
    },
    {
        "fieldName": "销售额",
        "type": "int",
        "role": "measure",
        "domain": [
            28,
            2350
        ]
    }
]

const dataset=[
    {
        "商品名称": "Coke",
        "region": "south",
        "销售额": 2350
    },
    {
        "商品名称": "Coke",
        "region": "east",
        "销售额": 1027
    },
    {
        "商品名称": "Coke",
        "region": "west",
        "销售额": 1027
    },
    {
        "商品名称": "Coke",
        "region": "north",
        "销售额": 1027
    },
    ...
]
const { chartType, spec, cell } = await vmind.generateChart(userPrompt, fieldInfo, dataset);
console.log(cell)
```
在这个例子中，生成了一个柱状图：

![柱状图](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_barchart.png)

其cell如下：

```json
{
  "x": "商品名称",
  "y": "销售额",
  "color": "region"
}
```

这表示VMind将商品名称字段映射到图表的x轴，销售额字段映射到y轴，region字段映射到柱子的颜色上。

### chartSource
图表生成来源。若成功使用LLM生成图表，则为具体的模型名；若最终使用[基于规则的图表生成](../guide/Basic_Tutorial/Chart_Advisor)，则为chart-advisor

## 生成spec模板
在没有具体数据集、仅有数据字段的情况下，我们也可能需要生成图表。比如，在进行查询之前，我们可以根据数据集中的字段先生成一个图表，之后依据图表的类型和含有的字段执行相关查询。在这种情况下，调用generateChart方法时无需传入具体的数据集，而是先产生一个spec模板，后续再通过fillSpecWithData方法获取最终用于图表渲染的spec。

下面展示如何使用generateChart方法生成一个spec模板：

```typescript
import VMind from '@visactor/vmind';

const vmind = new VMind(options)

const userPrompt = '展示不同地区商品销售额';
const fieldInfo=[
    {
        "fieldName": "商品名称",
        "type": "string",
        "role": "dimension",
        "domain": [
            "可乐",
            "雪碧",
            "芬达",
            "醒目"
        ]
    },
    {
        "fieldName": "region",
        "type": "string",
        "role": "dimension",
        "domain": [
            "south",
            "east",
            "west",
            "north"
        ]
    },
    {
        "fieldName": "销售额",
        "type": "int",
        "role": "measure",
        "domain": [
            28,
            2350
        ]
    }
]
//不传入dataset，生成spec模板
const { chartType, spec, cell } = await vmind.generateChart(userPrompt, fieldInfo);
```
此时我们已经得到了VMind生成的图表spec、字段映射cell和图表类型chartType。随后我们调用fillSpecWithData方法，向spec模板中填入数据：

```typescript
//向模板中填入数据
const dataset=[
    {
        "商品名称": "Coke",
        "region": "south",
        "销售额": 2350
    },
    {
        "商品名称": "Coke",
        "region": "east",
        "销售额": 1027
    },
    {
        "商品名称": "Coke",
        "region": "west",
        "销售额": 1027
    },
    {
        "商品名称": "Coke",
        "region": "north",
        "销售额": 1027
    },
    ...
]

const spec = vmind.fillSpecWithData(spec, dataset, cell, fieldInfo)
```
最终生成的spec可以用于渲染VChart图表。
