# 基于规则的图表生成
VMind可以结合内建的@visactor/chart-advisor，自动根据当前数据集生成图表。chart-advisor完整依赖于可视化规则，不需要调用大型语言模型。当你使用generateChart，而大模型无法成功生成图表时，VMind会使用chart-advisor作为备选方案来创建一个图表。

你同样可以主动选择使用chart-advisor来生成图表，只需在初始化VMind对象时，将模型类型设置为chart-advisor：
```ts
import VMind, { Model } from '@visactor/vmind'

const vmind = new VMind({
model: Model.CHART_ADVISOR,
})
const userPrompt = '';
const advisorResult = await vmind.generateChart(userPrompt, fieldInfo, dataset);
```
由于chart-advisor不依赖大型模型，userPrompt可以设为空。
你可以在[数据格式与数据处理](./Data_Process)章节了解fieldInfo和dataset的更多相关信息。

chart-advisor会根据一系列规则生成几种可用的图表，此时generateChart将返回包含图表类型、得分以及spec的列表。

## 示例
下面是一个使用商品销售额数据，通过chart-advisor生成图表的示例：

```ts
const dataset = [
{
"Product name": "Coke",
"Sales": 2350
},
{
"Product name": "Sprite",
"total_sales": 1056
},
{
"Product name": "Fanta",
"total_sales": 4778
},
{
"Product name": "Mirinda",
"total_sales": 3336
}
// ...more data
]

const fieldInfo = [
{
"fieldName": "Product name",
"type": "string",
"role": "dimension"
},
{
"fieldName": "Sales",
"type": "int",
"role": "measure"
}
]

const advisorResult = await vmind.generateChart(userPrompt, fieldInfo, dataset);

```
advisorResult结果如下：
```json
[
{
"chartSource": "chartAdvisor", //图表来源
"spec": ..., //生成的图表spec
"chartType": "BAR CHART", //图表类型
"score": 1, //当前图表得分
},
{
"chartSource": "chartAdvisor",
"spec": ..., //生成的图表spec
"chartType": "RADAR CHART", //图表类型
"score": 0.16666666666666666 //当前图表得分
}
]
```

其中，score表示当前图表类型与输入数据的匹配程度，分数越高表示该类型的图表越适用于展示当前数据。


生成的图表如下：

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_advisor.png)

根据输入数据的特性以及fieldInfo中的字段信息，chart-advisor会基于一整套可视化规则，为每种图表类型打分，并依分数将各图表类型排序。这些规则确保了可视化结果的准确度和美观性，并尽可能地减少图表中的视觉混乱和视觉错误。
