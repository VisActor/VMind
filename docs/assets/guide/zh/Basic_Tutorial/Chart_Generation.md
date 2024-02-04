# 图表生成
📢 注意：图表生成功能支持OpenAI GPT-3.5，GPT-4 系列模型和火山引擎[云雀（skylark-pro）](https://www.volcengine.com/product/yunque)系列模型，未来我们将支持更多的大语言模型，欢迎访问[Github页面](https://github.com/VisActor/VMind/issues/new/choose)提出你的需求。


本教程将介绍VMind中的图表智能生成函数，并提供一些使用示例

生成图表的途径多种多样，例如可以在PowerBI、Tableau等专业的BI可视化工具中，使用数据集中的字段制作可视化图表；或者直接使用VChart、ECharts、MatPlotlib等图表库，通过代码进行图表绘制。此外，VChart、Echarts等图表库还提供了简单易用的图表编辑器，用户可以上传数据并进行图表制作。


然而传统的图表生成方法，也面临很多难点：

- 小白用户不会写代码，不具备使用图表库生成图表的能力
- 图表类型多种多样，用户进行数据展示的目的也各不相同，这就导致了适合展示的图表类型和对应的字段映射也会有所不同。对于非专业用户来说，他们可能无法准确地选择出最适合表达自己观点的图表类型。
![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_chart_generation.png)
- 用户对于图表样式、动画的需求因人而异，常常需要具备一定设计能力才能满足。设计出令人眼前一亮的图表并不容易，它需要设计技能和审美意识，而这些是许多用户所缺乏的。



这就增加了数据可视化的创作门槛，阻碍了非专业用户创符合自己意图的可视化作品。

VMind提供的解决方法是，借助大语言模型的自然语言理解能力和公域知识，根据用户数据和展示意图，推荐合适的图表类型，并将字段映射到合适的视觉通道上，实现图表的智能生成，降低用户进行数据可视化的门槛。

## generateChart
VMind中的generateChart函数用于图表智能生成。该函数接收以下几个参数：
- userPrompt: 用户的可视化意图（想用图表展示哪些信息）
- fieldInfo: 数据集中字段的信息，字段名称，类型等
- dataset: 图表中使用的数据集
- enableDataQuery: 可选，是否在图表生成过程中开启数据聚合
- colorPalette: 可选，图表的调色板
- animationDuration: 可选，图表动画的动画播放持续时间

该方法将返回[VChart图表spec](https://www.visactor.io/vchart/guide/tutorial_docs/Basic/A_Basic_Spec)。


📢 **注意：generateChart方法会将userPrompt和fieldInfo传递给大语言模型用于生成图表，dataset中的明细数据并不会被传递。**


在生成图表时，VMind首先借助大语言模型，根据userPrompt和fieldInfo，推荐一个合适的图表类型，随后将fieldInfo中的字段映射到图表的x轴、y轴、颜色、尺寸等视觉通道上。


VMind默认给生成的图表添加了入场动画，因此还会返回图表动画时长time。将spec.animation设为false可关闭图表动画。


可以在[VChart动画教程](https://www.visactor.io/vchart/guide/tutorial_docs/Animation/Animation_Types)了解更多图表动画相关信息。

下面展示一个使用generateChart进行图表生成的例子：
```ts
import VMind from '@visactor/vmind';

const vmind = new VMind(options)
const userPrompt = 'show me the changes in sales rankings of various car brand';
const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset);
```
你可以在[创建VMind实例](./Create_VMind_Instance.md)了解如何创建VMind实例和options中的参数信息，在[数据格式与数据处理](./Data_Process.md)章节中获取更多关于fieldInfo和dataset的相关信息。

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

在userPrompt中，你可以描述你想展示的内容，这将作为大语言模型推荐图表类型时的依据；你也可以通过colorPalette传入一个颜色字符串数组，它将被用作图表的颜色主题。


## 参数详解
### userPrompt
你可以在userPrompt描述你想使用dataset展示什么内容，它将被传递给大语言模型用作图表生成时的参考。、

例如，对于下面这个手机品牌销售数据集：
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
你可以将userPrompt设置为`展示各品牌市场占有率`调用generateChart，它将为你生成一个饼图：

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_pie.png)


你也可以展示各品牌的净利润情况，修改userPrompt为：`展示各品牌的净利润`，生成的图表如下：

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_column.png)


你也可以指定图表类型，修改userPrompt为`展示各品牌的净利润，用折线图`，生成的图表如下：

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_line.png)


你也可以指定图表视觉通道的映射，例如`使用平均价格做x轴，净利润做y轴，品牌名称用作颜色，市场份额做点的大小，绘制散点图`:

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_scatter.png)


VMind的强大之处在于，用户无需关心图表生成的细节，仅需一句话描述需求，借助大语言模型所掌握的公域知识，便可以生成想要的图表。

例如对于下面这份数据
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

用户输入的展示意图为`展示男女早餐饭量不同`，将会生成一个双轴图：

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_dual_axis.png)


VMind还支持[动态条形图（ranking bar）](https://www.visactor.io/vchart/demo/storytelling/ranking-bar)这一叙事图表，它使用不断变化的柱状图展示不同时间节点不同种类的数据在排名上的变化。为了生成一个动态条形图，要求数据中必须有一个时间字段。

例如，我们有下面的dataset和fieldInfo:
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

若userPrompt为`Show me the change of the GDP rankings of each country`，则将生成一个动态条形图：
![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_dynamic_bar.gif)


为了使VMind生成符合预期的图表，你必须尽可能清晰地在userPrompt中描述你的展示意图、目的等信息。另外，你还必须确保数据集的字段名称具有一定的语义，或者在fieldInfo中添加字段描述，具体请见[数据格式与数据处理](./Data_Process.md)章节。

### enableDataQuery
在[数据聚合](./Data_Aggregation.md)章节中我们提到过，为了支持诸如`帮我展示销售额最多的10个部门`，`帮我展示北方区域各商品的销售额`等图表展示需求，需要对数据进行聚合后再用于图表生成。generateChart函数默认在执行过程中会调用一次dataQuery，使用相同的userPrompt，fieldInfo和dataset对数据进行聚合，使用聚合后的数据完成后续图表生成步骤。


如果你确定你的数据无需进行进一步的聚合、筛选和排序就可以满足用户的图表展示需求，你可以通过将enableDataQuery设置为false来强行关闭这一流程：
```ts
import VMind from '@visactor/vmind';

const vmind = new VMind(options)
const userPrompt = 'show me the changes in sales rankings of various car brand';
const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset, false); //将enableDataQuery设置为false，关闭数据聚合
```
这样可以减少一次调用大模型的过程，降低token消耗，提高图表生成速度。关于VMind数据聚合的更多信息，请见[数据聚合](./Data_Aggregation.md)章节。

## 支持的图表类型
VMind目前支持VChart中常见的13种图表类型：
- 柱状图
- 折线图
- 饼图
- 散点图
- 双轴图
- 词云
- 玫瑰图
- 雷达图
- 箱型图
- 漏斗图
- 桑基图
- 瀑布图
- [动态条形图（ranking bar）](https://www.visactor.io/vchart/demo/storytelling/ranking-bar)

根据userPrompt和fieldInfo的不同，这些图表类型都有可能被大语言模型推荐。


你可以在[Github页面](https://github.com/VisActor/VMind/issues/new/choose)提出你对新的图表类型的需求。







