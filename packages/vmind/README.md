<div align="center">
   <a href="https://github.com/VisActor#gh-light-mode-only" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/logo_500_200_light.svg"/>
  </a>
  <a href="https://github.com/VisActor#gh-dark-mode-only" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/logo_500_200_dark.svg"/>
  </a>
</div>

<div align="center">
  <h1>VMind</h1>
</div>

<div align="center">

Not just automatic, but also fantastic.Open-source solution for intelligent visualization.

<p align="center">
  <a href="https://www.visactor.io/vmind">Introduction</a> •
  <a href="https://www.visactor.io/vmind/example">Demo</a> •
  <a href="https://www.visactor.io/vmind/guide/Intro_to_VMind">Tutorial</a> •
  <a href="https://www.visactor.io/vmind/api/VMind_Instance">API</a>•
  <a href="https://www.visactor.io/vmind/openapi">OpenApi</a>
</p>

![](https://github.com/visactor/vmind/actions/workflows/bug-server.yml/badge.svg)
![](https://github.com/visactor/vmind/actions/workflows/unit-test.yml/badge.svg)
[![npm Version](https://img.shields.io/npm/v/@visactor/vmind.svg)](https://www.npmjs.com/package/@visactor/vmind)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vmind.svg)](https://www.npmjs.com/package/@visactor/vmind)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/VisActor/VMind/blob/main/CONTRIBUTING.md#your-first-pull-request)

![](https://img.shields.io/badge/language-TypeScript-red.svg) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vmind/blob/main/LICENSE)

</div>



<div align="center">

English | [简体中文](readme-zh.md)

</div>

## Introduction

`@visactor/vmind` is an intelligent chart component based on LLM provided by [VisActor](https://www.visactor.io/), including dialog-based chart generation and editing capabilities. It provides a natural language interaction interface, allowing you to easily create chart narrative works with `@visactor/VMind` with just one sentence, and edit them through continuous dialogue, greatly improving your efficiency in creating data visualization works.

The main features of `@visactor/vmind` include:

- **Easy to use**: Just provide the data you want to display and a sentence describing the information you want to display, and `@visactor/vmind` will automatically generate the chart for you. Based on the existing chart, describe the modifications you want to make to the chart in one sentence, and `@visactor/VMind` will help you achieve the desired effect.
- **Strong scalability**: The components of `@visactor/VMind` can be easily extended and customized, and new functions and features can be added as needed. By default, the OpenAI GPT model is used, and you can easily replace it with any LLM service.
- **Easy narrative**: Based on the powerful chart narrative ability of `@visactor/vchart`, `@visactor/VMind` supports the generation of various types of charts, including line charts, bar charts, pie charts, etc., and can also generate dynamic bar charts and other dynamic charts, making it easy for you to narrate data. More chart types are being added. You can also use the dialog-based editing function to easily modify chart styles and animation effects, making it easy for you to create narratives.
- **One-click export**: `@visactor/VMind` comes with a chart export module, and you can export the created chart narrative as a video or GIF for display.

## Development Guide

### Docs Page

Enter the VMind repository and execute:

```bash
# Install dependencies
$ rush update
# Start the demo page
$ rush docs
```


### Start the Development Page

Enter the VMind repository and execute:

```bash
# Install dependencies
$ rush update
# Start the VMind development page
$ rush vmind
```

You can start the vmind development page.
You need to set your LLM service URL and API key to use it normally. You can modify the headers when calling the LLM in packages/vmind/\_\_tests\_\_/browser/src/pages/DataInput.tsx.
You can create a new .env.local file in the packages/vmind folder and write in it:

```bash
VITE_GPT_URL="Your service url of gpt model"
VITE_GPT_KEY="Your api-key of gpt model"
VITE_DEEPSEEK_URL="https://api.deepseek.com/chat/completions"
VITE_DEEPSEEK_KEY="Your api-key of deepseek model"
VITE_CUSTOM_URL="Your service url of custom model"
VITE_CUSTOM_KEY="Your api-key of custom model"
VITE_CUSTOM_MODEL="Your Custom Model Name"
VITE_PROXY_CONFIG="Your Vite proxy config for forwarding requests. Must be in JSON string format and is optional. Example: {"proxy": {"/v1": {"target": "https://api.openai.com/","changeOrigin": true},"/openapi": {"target": "https://api.openai.com/","changeOrigin": true}}}"
```

These configurations will be automatically loaded when starting the development environment.

## Instructions for use

### 📦 Installation

```bash
# npm
$ npm install @visactor/vmind

# yarn
$ yarn add @visactor/vmind
```

### 📊 Usage Example

#### Intelligent Chart Generation

First, we need to install VMind in the project:

```bash
# Install with npm

npm install @visactor/vmind

# Install with yarn

yarn add @visactor/vmind
```

Next, import VMind at the top of the JavaScript file

```typescript
import VMind from '@visactor/vmind';
```

VMind currently supports GPT, deepseek, doubao and any other models with API Keys. Users can specify the model type to be called when initializing the VMind object, and pass in the URL of the LLM service. Next, we initialize a VMind instance and pass in the model type and model url:

```typescript
import { Model } from '@visactor/vmind';

const vmind = new VMind({
  url: LLM_SERVICE_URL, // URL of the LLM service
  model: Model.GPT4o, // Model to use
  headers: {
    'api-key': LLM_API_KEY
  } //headers will be used directly as the request header in the LLM request. You can put the model api key in the header
});
```

Here is a list of supported models:

```typescript
//models that VMind support
export enum Model {
  GPT3_5 = 'gpt-3.5-turbo',
  GPT3_5_1106 = 'gpt-3.5-turbo-1106',
  GPT4 = 'gpt-4',
  GPT_4_0613 = 'gpt-4-0613',
  GPT_4o = 'gpt-4o-2024-08-06',
  DOUBAO_LITE = 'doubao-lite-32K',
  DOUBAO_PRO = 'doubao-pro-128k',
  CHART_ADVISOR = 'chart-advisor',
  DEEPSEEK_V3 = 'deepseek-chat',
  DEEPSEEK_R1 = 'deepseek-reasoner'
}
```
And also you can use other model you like:
```typescript
import { Model } from '@visactor/vmind';

const vmind = new VMind({
  url: LLM_SERVICE_URL,
  model: LLM_MODEL_NAME, // Model You Choose
  headers: {
    'api-key': LLM_API_KEY
  }
});
```

VMind supports datasets in both CSV and JSON formats.

To use CSV data in subsequent processes, you need to call the data processing method to extract field information and convert it into a structured dataset. VMind provides a rule-based method `parseCSVData` to obtain field information:

```typescript
// Pass in the CSV string to obtain the fieldInfo and the JSON-structured dataset
const { fieldInfo, dataset } = vmind.parseCSVData(csv);
```

We can also call the `getFieldInfo` method to obtain the fieldInfo by passing in a JSON-formatted dataset:

```typescript
// Pass in a JSON-formatted dataset to obtain the fieldInfo
const dataset=[
{
"Product name": "Coke",
"region": "south",
"Sales": 2350
},
{
"Product name": "Coke",
"region": "east",
"Sales": 1027
},
{
"Product name": "Coke",
"region": "west",
"Sales": 1027
},
{
"Product name": "Coke",
"region": "north",
"Sales": 1027
}
]
const fieldInfo = vmind.getFieldInfo(dataset);
```

We want to show "the changes in sales rankings of various car brands". Call the generateChart method and pass the data and display content description directly to VMind:

```typescript
const userPrompt = 'show me the changes in sales rankings of various car brand';
//Call the chart generation interface to get spec and chart animation duration
const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset);
```

In this way, we get the VChart spec of the corresponding dynamic chart. We can render the chart based on this spec:

```typescript
import VChart from '@visactor/vchart';

<body>
<!-- Prepare a DOM with size (width and height) for vchart, of course you can also specify it in the spec configuration -->
<div id="chart" style="width: 600px;height:400px;"></div>
</body>

// Create a vchart instance
const vchart = new VChart(spec, { dom: 'chart' });
// Draw
vchart.renderAsync();
```

Thanks to the capabilities of the large language model, users can describe more requirements in natural language and "customize" dishes.
Users can specify different theme styles (currently only gpt chart generation supports this feature). For example, users can specify to generate a tech-style chart:

```typescript
//userPrompt can be in both Chinese and English
//Specify to generate a tech-style chart
const userPrompt = 'show me the changes in sales rankings of various car brand,tech style';
const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset);
```

You can also specify the chart type, field mapping, etc. supported by VMind. For example:

```typescript
//Specify to generate a line chart, with car manufacturers as the x-axis
const userPrompt =
  'show me the changes in sales rankings of various car brands,tech style.Using a line chart, Manufacturer makes the x-axis';
const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset);
```

#### Data Aggregation
When using the chart library to draw bar charts, line charts, etc., if the data is not aggregated, it will affect the visualization effect. At the same time, because no filtering and sorting of fields has been done, some visualization intentions cannot be met, for example: show me the top 10 departments with the most cost, show me the sales of various products in the north, etc.

VMind supports intelligent data aggregation since version 1.2.2. This function uses the data input by the user as a data table, uses a LLM to generate SQL queries according to the user's command, queries data from the data table, and uses GROUP BY and SQL aggregation methods to group, aggregate, sort, and filter data. Supported SQL statements include: SELECT, GROUP BY, WHERE, HAVING, ORDER BY, LIMIT. Supported aggregation methods are: MAX(), MIN(), SUM(), COUNT(), AVG(). Complex SQL operations such as subqueries, JOIN, and conditional statements are not supported.


Use the `dataQuery` function of the VMind object to aggregate data. This method has three parameters:
- userInput: user input. You can use the same input as generateChart
- fieldInfo: Dataset field information. The same as generateChart, it can be obtained by parseCSVData, or built by the user.
- dataset: Dataset. The same as generateChart, it can be obtained by parseCSVData, or built by the user.

```typescript
const { fieldInfo, dataset } = await vmind?.dataQuery(userInput, fieldInfo, dataset);
```


The fieldInfo and dataset returned by this method are the field information and dataset after data aggregation, which can be used for chart generation.
By default, the `generateChart` function will perform a data aggregation using the same user input before generating the chart. You can disable data aggregation by passing in the fourth parameter:
```typescript
const userInput = 'show me the changes in sales rankings of various car brand';
const { spec, time } = await vmind.generateChart(userInput, fieldInfo, dataset, false); //pass false as the forth parameter to disable data aggregation before generating a chart.
```

#### Data Insight
[Tutorial](https://visactor.io/vmind/guide/Basic_Tutorial/Chart_Insight)

#### Data Extraction: Text to Chart
[Tutorial](https://visactor.io/vmind/guide/Basic_Tutorial/Data_Extraction)

#### Dialog-based editing

Under development, stay tuned

### Effect display

#### Dynamic bar chart

![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-2.gif)

#### Bar chart

![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-1.gif)

#### Pie chart

![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-3.gif)

