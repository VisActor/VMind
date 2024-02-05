# VMind实例

## 接口描述

创建VMind实例接口用于创建一个VMind实例，该实例可以用于进行智能可视化操作。在创建VMind实例时，需要传入一个options对象作为参数，该对象中包含了一些关键的信息，例如模型的url，模型类型，以及LLM服务请求的headers等。


## 接口参数

### ILLMOptions

```ts
export interface ILLMOptions {
  url?: string; // LLM服务的URL，默认为openAI API
  headers?: HeadersInit; // LLM请求的header
  method?: 'POST' | 'GET'; // 请求方法，post或get
  model?: Model; // 模型类型
  max_tokens?: number; // 模型生成内容的最大token数量
  temperature?: number; // 模型生成内容的temperature
  showThoughts?: boolean; // 是否将模型的思考过程添加到输出结果中
  customRequestFunc?: {
    chartAdvisor: RequestFunc;
    dataProcess: RequestFunc;
    dataQuery: RequestFunc;
  }; // 自定义LLM服务的调用方法
  [key: string]: any;
}
```
```ts
type RequestFunc = (prompt: string, userMessage: string, options: ILLMOptions | undefined) => Promise<LLMResponse>;
```

```ts
export type LLMResponse = {
  choices: {
    index: number;
    message: any;
  }[];
  usage: any;
  [key: string]: any;
};
```

### url

url参数用于指定LLM服务api的地址，默认值是https://api.openai.com/v1/chat/completions。在使用VMind的过程中，所有需要调用LLM的地方都会向这个url发送http请求。

### headers

headers参数用于指定请求LLM服务时的http headers。最常见的用法是将你的api key放入headers中用作鉴权；当然，你也可以将任何你需要的字段放入headers中。

### method

method参数用于指定请求LLM时的方法类型，通常为POST。

### model

model参数用于指定模型种类。这个字段将被放入LLM服务的请求体中。你可以从VMind中引入Model类型并用作model字段的值。

```ts
export enum Model {
  GPT3_5 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4',
  SKYLARK = 'skylark-pro',
  SKYLARK2 = 'skylark2-pro-4k'
}
```

### max_tokens和temperature

max_tokens和temperature参数分别决定模型生成内容的最大token数量和temperature。在VMind中，这两个参数的默认值分别是2000和0，对于其他值的效果未经过充分测试，因此不建议修改。

### showThoughts

showThoughts参数将影响VMind传给大语言模型的prompt，决定其在完成图表生成、数据聚合等任务时，是否将思考过程添加到输出结果中。在VMind中，showThoughts默认为true。

### customRequestFunc

customRequestFunc参数允许用户自定义在每种任务中调用LLM的方法。例如，你可以通过RPC的形式请求你自己的LLM服务。


## 使用示例

```ts
import VMind, { Model } from '@visactor/vmind'

const vmind = new VMind({
  model: Model.GPT3_5, //使用gpt-3.5-turbo模型
  headers: { //指定调用LLM服务时的header
  Autho rization: `Bearer ${OPENAI_API_KEY}` //Your OPENAI_API_KEY
}
})
```

## 相关教程
[创建VMind实例](../guide/Basic_Tutorial/Create_VMind_Instance)
