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
- userPrompt: 用户的可视化意图（你想用图表展示什么信息）
- fieldInfo: 数据集中字段的信息，包括字段名称，类型等
- dataset: 用于图表的数据集
- enableDataQuery: 可选参数，决定是否在图表生成过程中开启数据聚合
- colorPalette: 可选参数，用于设置图表的调色板
- animationDuration: 可选参数，用于设置图表动画的播放持续时间

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
你可以在[创建VMind实例](./Create_VMind_Instance.md)中了解如何创建VMind实例和options中的参数信息，在[数据格式与数据处理](./Data_Process.md)章节中获取更多关于fieldInfo和dataset的相关信息。

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


为了让VMind生成符合预期的图表，你需要在`userPrompt`中尽可能清晰地描述你的展示意图和目的。此外，你还需要确保数据集的字段名称具有一定的语义，或者在字段信息中添加字段描述，具体请参见[数据格式与数据处理](./Data_Process.md)章节。


### enableDataQuery
在[数据聚合](./Data_Aggregation.md)章节中，我们已经介绍过，为了满足`展示销售额最多的10个部门`或`展示北方区域各商品的销售额`等图表展示需求，我们需要先对数据进行聚合，然后再生成图表。在默认情况下，`generateChart`函数会在执行过程中调用一次`dataQuery`，使用相同的`userPrompt`，`fieldInfo`和`dataset`对数据进行聚合，然后使用聚合后的数据完成后续的图表生成步骤。

然而，如果你确定你的数据无需进行进一步的聚合、筛选和排序就可以满足用户的图表展示需求，你可以通过将`enableDataQuery`设置为`false`来关闭这一流程：
```ts
import VMind from '@visactor/vmind';

const vmind = new VMind(options)
const userPrompt = 'show me the changes in sales rankings of various car brand';
const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset, false); //将enableDataQuery设置为false，关闭数据聚合
```
这样做可以减少一次调用大模型的过程，降低token消耗，提高图表生成速度。关于VMind数据聚合的更多信息，请参考[数据聚合](./Data_Aggregation.md)章节。

## VMind支持的图表类型
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

根据`userPrompt`和`fieldInfo`的不同，这些图表类型都有可能被大语言模型推荐。

如果你有新的图表类型需求，欢迎在我们的[Github页面](https://github.com/VisActor/VMind/issues/new/choose)提出。


