# v2.0.2

2025-02-23


**🔖 Fix**

- **@visactor/vmind**: fix fieldinfo may undefiend while chart-advistor

[更多详情请查看 v2.0.2](https://github.com/VisActor/VMind/releases/tag/v2.0.2)

# v2.0.1

2025-02-21


**🆕 新增功能**

- **@visactor/vmind**: Support DeepSeek and other custom model with api-key
- **@visactor/vmind**: 12 new chart types added for chart generation
- **@visactor/vmind**: Add text2Chart API
- **@visactor/vmind**: Add getInsights API

**🔖 其他**

- **@visactor/vmind**: Overall architecture upgrade


[更多详情请查看 v2.0.1](https://github.com/VisActor/VMind/releases/tag/v2.0.1)

# v1.2.12

2024-06-17


**🔖 新增功能ure**

- **@visactor/vmind**: intelligent insight module
- **@visactor/vmind**: add custom model type support
- **@visactor/vmind**: take skylark model when no model type match

[更多详情请查看 v1.2.12](https://github.com/VisActor/VMind/releases/tag/v1.2.12)

# v1.2.11

2024-04-24


**🐛 Fixes**

Fix reference error in node.

[更多详情请查看 v1.2.11](https://github.com/VisActor/VMind/releases/tag/v1.2.11)

# v1.2.9

2024-04-19


**🆕 New 新增功能ures**

- **@visactor/vmind**: Refactored the VMind basic framework: abstracted TaskNode, Application class, used Meta for flow arrangement, and improved code reusability and scalability.
- **@visactor/vmind**: Intelligent chart generation: supports generating spec templates without a data set; supports filling data into spec templates.
- **@visactor/vmind**: Intelligent chart generation: supports selecting chart types from a specified list of chart types.

**🐛 Fixes**

Intelligent data aggregation: replaced alasql keyword in SQL to further improve the success rate of SQL execution.

[更多详情请查看 v1.2.9](https://github.com/VisActor/VMind/releases/tag/v1.2.9)


# v1.2.7

2024-03-26

**🆕 新增功能**

- **@visactor/vmind**：支持 skylark 进行数据聚合
- **@visactor/vmind**：支持规则型图表生成
- **@visactor/vmind**：在存在多个y字段时使用fold来处理数据集

**🐛 功能修复**

修复了在数据聚合和图表生成中的若干问题。

[更多详情请查看 v1.2.7](https://github.com/VisActor/VMind/releases/tag/v1.2.7)

# v1.2.4

**规划功能：**

- GIF、视频导出功能支持node环境
- 进一步规范API
- 移除无关依赖
- 数据聚合功能优化，修复大量badcase
- 图表智能生成 badcase修复

# v1.2.3

**规划功能：**

- 数据聚合功能，接入headless bi calculator模块、vutils
- 智能数据聚合，通过大模型生成sql，对数据进行聚合、筛选、排序

# v1.2.0

**规划功能：**

1. 数据模块改造，支持外部直接传dataset，不使用模型进行字段类型解析
2. 图表智能生成接入skylark pro，skylark2-pro-4k模型
3. 图表生成性能优化

# v1.1.0

**规划功能：**

1. 新增图表类型支持：双轴图、漏斗图、瀑布图、箱型图
2. 数据模块重构，对接VizSchema
3. 增加生成图表失败时的兜底机制，使用chart-advisor模块进行图表推荐

# v1.0.6-alpha.5

1. 新增图表类型支持：桑基图、雷达图、玫瑰图
2. 修复依赖报错
3. 支持node端调用
4. 支持初始化时传入url和请求参数，自定义模型请求方式：可以自定义包括大模型服务URL、请求头、请求方法、模型名称、最大tokens和温度等参数
5. 移除ffmpeg依赖，改为外部传入，减少了包体积和依赖安装难度
