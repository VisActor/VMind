# VMind实例

## 接口描述

创建VMind实例接口用于创建一个VMind实例，该实例可以用于进行智能可视化操作。在创建VMind实例时，需要传入一个options对象作为参数，该对象中包含了一些关键的信息，例如模型的url，模型类型，以及LLM服务请求的headers等。


## 接口参数

### VMindOptions

```ts
export interface VMindOptions {
  /** URL of your LLM service. For gpt, default is openAI API. */
  url?: string;
  /** llm request header, which has higher priority */
  headers?: HeadersInit;
  /** post or get */
  method?: 'POST' | 'GET';
  /** LLM Model */
  model?: Model | string;
  /** Max token in LLM Chart */
  maxTokens?: number;
  /** Temperature of LLM */
  temperature?: number;
  /** show llm thoughs or not */
  showThoughts?: boolean;
  /** repetition penalty */
  frequencyPenalty?: number;
  /** topP */
  topP?: number;
  /** custom llm request func */
  customRequestFunc?: {
    /** 图表生成任务 */
    chartAdvisor?: RequestFunc;
    /** 数据查询任务 */
    dataQuery?: RequestFunc;
    /** 文本中提取数据任务 */
    dataExtraction?: RequestFunc;
    /** 图表生成中指令生成任务 */
    chartCommand?: RequestFunc;
    /** 洞察生成任务 */
    IntelligentInsight?: RequestFunc;
  };
}
```

### url

url参数用于指定LLM服务api的地址，默认值是https://api.openai.com/v1/chat/completions。在使用VMind的过程中，所有需要调用LLM的地方都会向这个url发送http请求。

### headers

headers参数用于指定请求LLM服务时的http headers。最常见的用法是将你的api key放入headers中用作鉴权；当然，你也可以将任何你需要的字段放入headers中。

### method

method参数用于指定请求LLM时的方法类型，通常为POST。

### model

model参数用于指定模型种类。这个字段将被放入LLM服务的请求体中。你可以从VMind中引入Model类型并用作model字段的值。也可以指定除VMind Model之外其他任何Model名称

```ts
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

### max_tokens和temperature

这两个参数分别决定模型生成内容的最大token数量和每次生成结果的随机性，详见[OpenAI官方文档](https://platform.openai.com/docs/api-reference/chat/create)。

在VMind中，这两个参数的默认值分别是2048和0.

### TopP
用于控制输出tokens的多样性，TopP值越大输出的tokens类型越丰富，取值范围0~1，VMind默认为0.


### frequencyPenalty
-2.0到2.0之间的数字，正值会根据新token在文本中出现的频率对其进行惩罚，从而降低模型逐字重复同一行的可能性。VMind默认为0.

### showThoughts

showThoughts参数将影响VMind传给大语言模型的prompt，决定其在完成图表生成、数据聚合等任务时，是否将思考过程添加到输出结果中。在VMind中，showThoughts默认为true。

### customRequestFunc

customRequestFunc参数允许用户自定义在每种任务中调用LLM的方法。例如，你可以通过RPC的形式请求你自己的LLM服务。

## 使用示例

```ts
import VMind, { Model } from '@visactor/vmind'

const vmind = new VMind({
  model: Model.GPT4o, //使用gpt-4o模型
  headers: { //指定调用LLM服务时的header
    Authorization: `Bearer ${OPENAI_API_KEY}` //Your OPENAI_API_KEY
  }
})
```

## 相关教程
[创建VMind实例](../guide/Basic_Tutorial/Create_VMind_Instance)
