# v2.0.3

2025-03-05

**🆕 New Features**

- **atom**: VMind's internal atomization feature now supports function call capability

**🔖 Fixes**

- **chartGeneration**: Fixed issues where stacked/percentage bar charts were not working, and bar charts were not generating correctly
- **getInsights**: Fixed an issue where, if chart values were strings, the original data obtained by insights was converted to number type, potentially causing incorrect matches

**🔖 Others**

- **@visactor/vmind**: Optimized type definitions

[more detail about v2.0.3](https://github.com/VisActor/VMind/releases/tag/v2.0.3)

# v2.0.3

2025-03-04

**🆕 New Features**

- **atom**: VMind's internal atomization feature now supports function call capability

**🔖 Fixes**

- **chartGeneration**: Fixed issues where stacked/percentage bar charts were not working, and bar charts were not generating correctly
- **getInsights**: Fixed an issue where, if chart values were strings, the original data obtained by insights was converted to number type, potentially causing incorrect matches

**🔖 Others**

- **@visactor/vmind**: Optimized type definitions

# v2.0.2

2025-02-23


**🔖 Fix**

- **@visactor/vmind**: fix fieldinfo may undefiend while chart-advistor

[more detail about v2.0.2](https://github.com/VisActor/VMind/releases/tag/v2.0.2)

# v2.0.1

2025-02-21


**🆕 New feature**

- **@visactor/vmind**: Support DeepSeek and other custom model with api-key
- **@visactor/vmind**: 12 new chart types added for chart generation
- **@visactor/vmind**: Add text2Chart API
- **@visactor/vmind**: Add getInsights API

**🔖 other**

- **@visactor/vmind**: Overall architecture upgrade


[more detail about v2.0.1](https://github.com/VisActor/VMind/releases/tag/v2.0.1)

# v1.2.12

2024-06-17


**🔖 New featureure**

- **@visactor/vmind**: intelligent insight module
- **@visactor/vmind**: add custom model type support
- **@visactor/vmind**: take skylark model when no model type match

[more detail about v1.2.12](https://github.com/VisActor/VMind/releases/tag/v1.2.12)

# v1.2.11

2024-04-24


**🐛 Fixes**

Fix reference error in node.

[more detail about v1.2.11](https://github.com/VisActor/VMind/releases/tag/v1.2.11)

# v1.2.9

2024-04-19


**🆕 New New featureures**

- **@visactor/vmind**: Refactored the VMind basic framework: abstracted TaskNode, Application class, used Meta for flow arrangement, and improved code reusability and scalability.
- **@visactor/vmind**: Intelligent chart generation: supports generating spec templates without a data set; supports filling data into spec templates.
- **@visactor/vmind**: Intelligent chart generation: supports selecting chart types from a specified list of chart types.

**🐛 Fixes**

Intelligent data aggregation: replaced alasql keyword in SQL to further improve the success rate of SQL execution.

[more detail about v1.2.9](https://github.com/VisActor/VMind/releases/tag/v1.2.9)


# v1.2.7

March 26, 2024

**🆕 New Features**

- **@visactor/vmind**: support data aggregation with skylark
- **@visactor/vmind**: support rule-based chart generation
- **@visactor/vmind**: use fold to process the dataset when there are more than 1 y field

**🐛 Bug Fixes**

Fixed several badcases in data aggregation and chart generation.

[For more details, please see v1.2.7](https://github.com/VisActor/VMind/releases/tag/v1.2.7)

# v1.2.4

**Planned Features**

- GIF, video export function supports node environment
- Further standardize API
- Remove unrelated dependencies
- Optimize data aggregation function, fix a large number of badcases
- Smart Chart Generation fixes badcases

# v1.2.3

**Planned Features**

- Data aggregation function, access to headless bi calculator module, vutils
- Intelligent data aggregation, generate SQL through LLM, aggregate, filter, and sort data

# v1.2.0

**Planned Features**

1. Data module restructuring, supports direct external transmission of the dataset, bypassing the interpretation of field types by LLM.
2. Intelligent chart generation accesses skylark pro, skylark2-pro-4k models
3. Optimize chart generation performance

# v1.1.0

**Planned Features**

1. Support new chart types: Dual Axis Chart, Funnel Chart, Waterfall Chart, Box Plot
2. Refactor the data module, dock with VizSchema
3. Add a fallback mechanism when the chart generation fails, recommend charts using the chart-advisor module.

# v1.0.6-alpha.5

1. Support new chart types: Sankey Diagram, Radar Chart, Rose Chart.
2. Fixed dependency errors.
3. Support for node-side calls.
4. Support for entering url and request parameters during initialization, customize model request methods: you can customize parameters such as LLM service URL, request headers, request methods, model names, maximum tokens, and temperature, etc.
5. Removed the ffmpeg dependency, replaced with external input to reduce the package volume and difficulty of installing dependencies.
