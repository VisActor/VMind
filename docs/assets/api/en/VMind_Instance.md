# VMind Instance

## Interface Description

The Create VMind Instance interface is used to create a VMind instance, which can be used for intelligent visualization operations. When creating a VMind instance, an options object needs to be passed in as a parameter. This object contains some key information, such as the url of the model, the type of model, and the headers of the LLM service request, etc.


## Interface Parameters

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
    /** chart generation task */
    chartAdvisor?: RequestFunc;
    /** data query task */
    dataQuery?: RequestFunc;
    /** data extraction from text task */
    dataExtraction?: RequestFunc;
    /** chart command auto generation task */
    chartCommand?: RequestFunc;
    /** insight task */
    IntelligentInsight?: RequestFunc;
  };
}
```

### url

The url parameter is used to specify the address of the LLM service api, the default value is https://api.openai.com/v1/chat/completions. During the use of VMind, all places that need to call LLM will send http requests to this url.

### headers

The headers parameter is used to specify the http headers when requesting the LLM service. The most common usage is to put your api key in the headers for authentication; of course, you can also put any fields you need in the headers.

### method

The method parameter is used to specify the method type when requesting LLM, usually POST.

### model

The model parameter is used to specify the type of model. This field will be put into the request body of the LLM service. You can import the Model type from VMind and use it as the value of the model field. Any model name other than VMind Model can also be specified.

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

### max_tokens and temperature

These two parameters respectively determine the maximum token quantity and the randomness of each generated result of the model, see [OpenAI official documentation](https://platform.openai.com/docs/api-reference/chat/create).

In VMind, the default values of these two parameters are 2048 and 0 respectively.

### showThoughts

The showThoughts parameter will affect the prompt that VMind sends to the large language model, determining whether to add the thinking process to the output results when completing tasks such as chart generation, data aggregation, etc. In VMind, showThoughts defaults to true.

### TopP
Used to control the diversity of output tokens. The larger the TopP value, the more diverse the types of output tokens. The range is 0 to 1, and the default in VMind is 0.

### frequencyPenalty
A number between -2.0 and 2.0. Positive values penalize new tokens based on their frequency in the text, reducing the likelihood of the model repeating the same line verbatim. The default in VMind is 0.

### customRequestFunc

The customRequestFunc parameter allows users to customize the method of calling LLM in each task. For example, you can request your own LLM service in the form of RPC.

## Usage Example

```ts
import VMind, { Model } from '@visactor/vmind'

const vmind = new VMind({
  model: Model.GPT4o, // use gpt-4o model
  headers: { // specify the header when calling the LLM service
    Authorization: `Bearer ${OPENAI_API_KEY}` // Your OPENAI_API_KEY
  }
})
```

## Related Tutorials
[Create VMind Instance](../guide/Basic_Tutorial/Create_VMind_Instance)
