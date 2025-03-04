
# Creating a VMind Instance
To start using the VMind intelligent visualization component, you first need to create a VMind instance. When creating a VMind instance, you need to pass in an options object as a parameter. This object contains some key information, such as the URL of the model, the model type, and the headers of the LLM service request, etc.
```ts
import VMind from '@visactor/vmind'

const vmind = new VMind(options)
```

The complete type definition of options is as follows:

```ts
export interface ILLMOptions {
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
  /** show llm thoughts or not */
  showThoughts?: boolean;
  /** repetition penalty */
  frequencyPenalty?: number;
  /** topP */
  topP?: number;
}
```
In ILLMOptions, most parameters will be passed directly to the LLM service.

## Example with GPT

If you plan to use the LLM service provided by OpenAI official and authenticate through the OpenAI API key in headers, you can simply initialize VMind like this:

```ts
import VMind, { Model } from '@visactor/vmind'

const vmind = new VMind({
  model: Model.GPT4o, // use gpt-4o model
  headers: { // specify the header when calling the LLM service
    Authorization: `Bearer ${OPENAI_API_KEY}` // Your OPENAI_API_KEY
  }
})
```

## Example with DeepSeek

If you plan to use DeepSeek as the LLM service, you can register your own API key on the [DeepSeek official website](https://platform.deepseek.com/api_keys). After registration, you can register and use VMind as follows. For more details, please refer to the [DeepSeek official API documentation](https://api-docs.deepseek.com/zh-cn/).


```ts
import VMind, { Model } from '@visactor/vmind'

const vmind = new VMind({
  url: 'https://api.deepseek.com/chat/completions', // DeepSeek official URL
  model: Model.DEEPSEEK_V3, // use DeepSeek-V3 model
  headers: { 
    Authorization: `Bearer ${DEEPSEEK_KEY}` // Your DEEPSEEK_KEY
  }
})
```

## Custom Model

If you want to use any other large model as the LLM service for VMind, similar to the previous examples, you only need to change the `url` and `model` to your model service address and add `headers` content for authentication verification. As follows:

```ts
import VMind, { Model } from '@visactor/vmind'

const vmind = new VMind({
  url: 'Your LLM URL',
  model: 'Your Model Name',
  headers: { 
    Authorization: `Bearer ${Your Key}`
  }
})
```

## url
The url parameter is used to specify the address of your LLM service api. The default value is https://api.openai.com/v1/chat/completions

In your use of VMind, all places that need to call the LLM will send http requests to this url.

## headers
You can specify the http headers when requesting the LLM service through the headers parameter. The most common usage is to put your api key in headers for authentication; of course, you can also put any fields you need into headers.

## method
The method parameter is used to specify the method type when requesting the LLM, usually POST.

## model
You can specify the model type through the model parameter. This field will be put into the request body of the LLM service. You can import the Model type from VMind and use it as the value of the model field.

```ts
import { Model } from '@visactor/vmind'
```

The currently supported model types are:

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

Currently, VMind uses the same technology and prompts for all large models to complete various intelligent tasks.

## max_tokens and temperature
These two parameters respectively determine the maximum token quantity and the randomness of each generated result of the model, see [OpenAI official documentation](https://platform.openai.com/docs/api-reference/chat/create).

In VMind, the default values of these two parameters are 2048 and 0 respectively.

## showThoughts
[Related research](https://arxiv.org/abs/2201.11903) shows that the Chain-of-Thought can enhance the thinking reasoning ability of large language models and make the output results more in line with expectations. The showThoughts parameter will affect the prompt that VMind sends to the large language model, determining whether to add the thinking process to the output results when completing tasks such as chart generation and data aggregation. `showThoughts = true` will make the model explicitly output its thinking process, improving the accuracy of the generated results. However, this will increase the length of the model-generated results, bringing more token consumption. When performing tasks such as chart generation, VMind must wait for the model output to end before proceeding to the next step, which will also slow down the execution speed of various VMind methods.

Therefore, if you expect better execution results, you can set showThoughts to true. If you want VMind to complete tasks such as chart generation and data aggregation with fewer tokens and faster speed, you can set this parameter to false.

In VMind, showThoughts defaults to true.

# Conclusion
This tutorial details how to create a VMind instance and how to set various parameters to meet different needs. We learned how to specify the URL of the model service, how to set headers for authentication, how to choose the model type, and how to set the maximum token quantity and temperature of the model-generated content. We also learned how to control whether the model adds the thinking process to the output results through the showThoughts parameter.

Through this tutorial, you can not only learn how to create and configure VMind instances, but also understand how to adjust and optimize the use of VMind according to your own needs and environment, so as to more effectively use VMind to complete various tasks, including chart generation, data processing, and data aggregation, etc.

