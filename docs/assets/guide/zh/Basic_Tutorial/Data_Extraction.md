# 数据提取——从文本一步生成图表

在前文[图表生成](./Chart_Generation)中，我们已经了解了如何从已有的结构化数据中智能生成图表。然而在部分场景中，我们并不一定已有数据集，可能有的事更为原始的数据，例如：文本数据。
在本篇教程中，我们将介绍如果通过 VMind , 直接从一段文本中直接生成图表。

## text2Chart
VMind的`text2Chart`函数与`generateChart`类似，主要不同在于，此时的入参从数据表和字段信息变成了纯文本内容，具体如下：
- text (string): 必选，原始文本内容
- userPrompt (string): 可选，用户的可视化意图（你想从文本中主要提取哪些数据，如何用图表进行展示）
- options: 可选，选项参数，包括以下内容：
  - fieldInfo (Array): 文本类型中包含的字段信息，包括字段名称，类型等
  - chartTypeList (ChartType[]，可选): 支持的图表类型列表。若不为undefined，则会从该列表指定的图表类型中选择生成。
  - enableDataQuery (boolean, 可选): 决定是否在图表生成过程中开启数据聚合
  - colorPalette (Array<string>, 可选): 用于设置图表的调色板
  - animationDuration (number, 可选): 用于设置图表动画的播放持续时间
  - theme (ChartTheme | string, 可选): 设置最终sepc的主题样式，默认为空，VMind会默认使用带渐变颜色的主题样式，可以设置 VChart 通用深浅主题（'light' | 'dark')或者符合你使用场景下的主题样式

这个方法会返回一个[VChart图表spec](https://www.visactor.io/vchart/guide/tutorial_docs/Basic/A_Basic_Spec)和一个二维数据表，详见[数据格式与数据处理](./Data_Process)。

在整个过程中，VMind首先会用大模型从原始文本中提取结构化的表格数据，并且自动对表格数据进行数据清理，之后就跟智能生成图表一样，再利用大模型得到推荐的图表类型和具体映射方式，最终VMind根据结果生成拼装产生最终的VChart spec.

VMind默认会为生成的图表添加入场动画，因此它还会返回图表动画的时长time。如果你不想要图表动画，可以将spec.animation设为false。

你可以在[VChart动画教程](https://www.visactor.io/vchart/guide/tutorial_docs/Animation/Animation_Types)中了解更多关于图表动画的信息。

## 使用案例
下面是一个使用text2Chart生成图表的例子：

```ts
import VMind from '@visactor/vmind';

const vmind = new VMind(options);
const text = '全国人口[2]中，拥有大学（指大专及以上）文化程度的人口为218360767人；拥有高中（含中专）文化程度的人口为213005258人；拥有初中文化程度的人口为487163489人；拥有小学文化程度的人口为349658828人（以上各种受教育程度的人包括各类学校的毕业生、肄业生和在校生）。';
const userPrompt = '对比本次人口普查各文化程度的人口比重';
const { spec, time, dataTable } = await vmind.generateChart(text, userPrompt);

console.log(dataTable);
// 数据表结果如下所示
dataTable = [
    {
        "文化程度": "大学",
        "人口数量": 218360767
    },
    {
        "文化程度": "高中",
        "人口数量": 213005258
    },
    {
        "文化程度": "初中",
        "人口数量": 487163489
    },
    {
        "文化程度": "小学",
        "人口数量": 349658828
    }
]
```
其中图表spec的结果如下图所示：
![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind_text_2_chart_1.jpeg)

## 参数详解
该函数的参数几乎与`generateChart`相同，详见：[图表生成](./Chart_Generation)参数详解部分