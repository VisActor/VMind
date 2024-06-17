# VMind Open API
对于某些不适合接入前端SDK（例如Python Notebook或后端场景）或者不方便申请LLM服务的场景，我们还提供了Open API服务，用户可以通过HTTP请求的形式使用VMind，满足多样化的图表可视化需求。

## Open API请求示例：
```curl
curl --location 'VMind Open API服务地址' \
--header 'api-key: 服务密钥' \
--form 'data="[
    {
        \"商品名称\": \"可乐\",
        \"region\": \"south\",
        \"销售额\": 2350
    },
    {
        \"商品名称\": \"可乐\",
        \"region\": \"east\",
        \"销售额\": 1027
    },
    {
        \"商品名称\": \"可乐\",
        \"region\": \"west\",
        \"销售额\": 1027
    }
]"' \
--form 'model="skylark"' \
--form 'userPrompt="帮我展示北方各商品销售额"' \
```

返回值：
```json
{
    "chart": [
        {
            "chartSource": "skylark2-pro-4k-v1.2", //图表生成来源
            "chartType": "BAR CHART", //图表类型
            "spec": { //生成的VChart Spec
                "type": "bar",
                "xField": [
                    "region",
                    "商品名称"
                ],
                "yField": "销售额",
                "seriesField": "商品名称",
                //...省略更多spec内容
            },
            "usage": { //LLM token消耗明细
                "completion_tokens": 19,
                "prompt_tokens": 1109,
                "total_tokens": 1128
            },
            "time": { //图表动画时长
                "totalTime": 2000,
                "frameArr": []
            }
        }
    ]
}
```

VMind Open API目前支持skylark2-pro模型进行智能数据聚合和图表生成，以及chart-advisor完成基于规则的图表推荐。

## 接口说明
### /generateChart
- 根据数据和用户输入的自然语言，生成vchart spec用于图表渲染。
- 若userPrompt和model为空，则不调用大模型，仅根据数据完成图表推荐，生成一系列图表spec，根据推荐程度排序。
- 若data为空，则生成不包含数据的spec模板，后期可调用fillSpecWithData接口填充数据。
- VMind确保仅将数据字段信息（字段名称、字段类型）传递给大模型，明细数据不会传递给大模型。
#### 调用方法
POST
#### 参数说明
- data
说明：图表中使用的数据集，json 数组结构。可以为空。data为空则生成spec模板，后期可调用fillSpecWithData接口填充数据。

- userPrompt
说明：可选，用户输入的自然语言，字符串类型。可指定图表类型和字段分配，可进一步进行数据聚合、筛选、排序。
示例：
```
帮我展示不同区域各商品销售额
展示各商品销售数据，使用折线图
北方销售额前三的商品
哪种商品卖的最多
不同地区商品销售状况
展示各商品销售数据，地区做x轴，商品类型做颜色
```

- model
可选值：skylark
说明：可选，模型类型，当前仅支持skylark

- mode
可选值："accuracyFirst" ， "performanceFirst"
说明：可选，图表生成模式，性能优先还是准确性优先。accuracyFirst会导致数据聚合和图表生成准确性提高，但生成速度将会受影响。performanceFirst会提高图表生成和数据聚合的速度，但准确性可能会受影响。默认为performanceFirst

- enableDataQuery
可选值：true或false
说明：可选，是否开启智能数据聚合。开启后将支持userPrompt中的数据聚合、筛选、排序、分组等指令，例如：
```
帮我展示北方各商品销售额
展示南方卖的最多的3种商品
生成折线图，按照日期聚合
展示销量前5名的商品
```
默认为true，开启后会增加接口响应时间。

- chartTypeList
字符串数组
说明：可选，图表类型列表，用于限制图表生成服务生成的图表类型。仅会生成该列表中的图表类型。不传该参数则默认生成所有图表类型。

可选值：

```
"Bar Chart"
"Line Chart"
"Pie Chart"
"Scatter Plot"
"Word Cloud"
"Rose Chart"
"Radar Chart"
"Sankey Chart"
"Funnel Chart"
"Dual Axis Chart"
"Waterfall Chart"
"Box Plot"
"Dynamic Bar Chart"
```

示例：
```json
[
"Bar Chart",
"Line Chart",
"Pie Chart",
"Scatter Plot"
]//仅生成柱状图、折线图、饼图、散点图
```

#### 返回值
- chart

说明：图表生成结果，json数组结构

```typescript
type chartGenerationResult = {
chart:{
  chartType : string; //图表类型
  spec: Spec; //该图表类型对应的vchart spec，可用于前端渲染
  score: number; //图表推荐得分，分数越高代表当前数据越适合用这种图表展示
  chartSource: string //图表来源，chartAdvisor表示基于规则的图表推荐，不调用大模型；若调用大模型完成了图表生成，则为对应的模型名
 }[]
}
```

## 联系方式
若有VMind Open API接入意向，欢迎加入飞书群创建话题，或关注微信公众号，加入微信群联系相关人员。

- 飞书：

<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/open_api_lark_group.png" >

- 微信公众号（通过公众号菜单可以加入微信群和飞书群）：

![](http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/visactor-site/blog/a39d9483e530417ba9a780f4d079c201.gif)
