# VMind Instance

## Interface Description

The Create VMind Instance interface is used to create a VMind instance, which can be used for intelligent visualization operations. When creating a VMind instance, an options object needs to be passed in as a parameter. This object contains some key information, such as the url of the model, the type of model, and the headers of the LLM service request, etc.


## Interface Parameters

### ILLMOptions

```ts
export interface ILLMOptions {
  url?: string; // URL of the LLM service, default is openAI API
  headers?: HeadersInit; // header of the LLM request
  method?: 'POST' | 'GET'; // request method, post or get
  model?: Model; // model type
  max_tokens?: number; // maximum number of tokens for model-generated content
  temperature?: number; // temperature of model-generated content
  showThoughts?: boolean; // whether to add the model's thinking process to the output results
  customRequestFunc?: {
    chartAdvisor: RequestFunc;
    dataQuery: RequestFunc;
  }; // custom method for calling the LLM service
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

The url parameter is used to specify the address of the LLM service api, the default value is https://api.openai.com/v1/chat/completions. During the use of VMind, all places that need to call LLM will send http requests to this url.

### headers

The headers parameter is used to specify the http headers when requesting the LLM service. The most common usage is to put your api key in the headers for authentication; of course, you can also put any fields you need in the headers.

### method

The method parameter is used to specify the method type when requesting LLM, usually POST.

### model

The model parameter is used to specify the type of model. This field will be put into the request body of the LLM service. You can import the Model type from VMind and use it as the value of the model field.

```ts
export enum Model {
  GPT3_5 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4',
  SKYLARK = 'skylark-pro',
  SKYLARK2 = 'skylark2-pro-4k'
}
```

### max_tokens and temperature

The max_tokens and temperature parameters determine the maximum number of tokens and temperature of the model-generated content, respectively. In VMind, the default values of these two parameters are 2000 and 0, respectively. The effects of other values have not been fully tested, so it is not recommended to modify them.

### showThoughts

The showThoughts parameter will affect the prompt that VMind sends to the large language model, determining whether to add the thinking process to the output results when completing tasks such as chart generation, data aggregation, etc. In VMind, showThoughts defaults to true.

### customRequestFunc

The customRequestFunc parameter allows users to customize the method of calling LLM in each task. For example, you can request your own LLM service in the form of RPC.


## Usage Example

```ts
import VMind, { Model } from '@visactor/vmind'

const vmind = new VMind({
  model: Model.GPT3_5, //use gpt-3.5-turbo model
  headers: { //specify the header when calling the LLM service
    Authorization: `Bearer ${OPENAI_API_KEY}` //Your OPENAI_API_KEY
  }
})
```

## Related Tutorials
[Create VMind Instance](../guide/Basic_Tutorial/Create_VMind_Instance)
