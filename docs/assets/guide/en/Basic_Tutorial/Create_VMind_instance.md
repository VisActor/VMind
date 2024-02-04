
# Creating a VMind Instance
To start using the VMind intelligent visualization component, you first need to create a VMind instance. When creating a VMind instance, you need to pass in an options object as a parameter. This object contains some key information, such as the URL of the model, the model type, and the headers of the LLM service request, etc.
```ts
import VMind from '@visactor/vmind'

const vmind = new VMind(options)
```

The complete type definition of options is as follows:

```ts
export interface ILLMOptions {
  url?: string; //URL of your LLM service. For gpt, default is openAI API.
  /** llm request header, which has higher priority */
  headers?: HeadersInit; // this will be used directly as the header of the LLM request.
  method?: 'POST' | 'GET'; //post or get
  model?: Model;
  max_tokens?: number;
  temperature?: number;
  showThoughts?: boolean;
  customRequestFunc?: {
  chartAdvisor: requestFunc;
  dataProcess: requestFunc;
  dataQuery: requestFunc;
  };
  [key: string]: any;
}

```
In ILLMOptions, most parameters will be passed directly to the LLM service.

If you plan to use the LLM service provided by OpenAI official and authenticate through the OpenAI api key in headers, you can simply initialize VMind like this:
```ts
import VMind, { Model } from '@visactor/vmind'

const vmind = new VMind({
    model: Model.GPT3_5, //use gpt-3.5-turbo model
    headers: { //specify the header when calling the LLM service
    Authorization: `Bearer ${OPENAI_API_KEY}` //Your OPENAI_API_KEY
}
})
```
In the following sections, we will explain the parameters in ILLMOptions in detail.

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
//models that VMind support
//more models is under developing
export enum Model {
  GPT3_5 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4',
  SKYLARK = 'skylark-pro',
  SKYLARK2 = 'skylark2-pro-4k'
}
```

For different model types, VMind will use different technical implementations to complete tasks such as chart generation.

## max_tokens and temperature
These two parameters respectively determine the maximum token quantity and temperature of the model-generated content, see [OpenAI official documentation](https://platform.openai.com/docs/api-reference/chat/create).

In VMind, the default values of these two parameters are 2000 and 0 respectively. The effects of other values have not been fully tested, so it is not recommended to modify them.

## showThoughts
[Related research](https://arxiv.org/abs/2201.11903) shows that the Chain-of-Thought can enhance the thinking reasoning ability of large language models and make the output results more in line with expectations. The showThoughts parameter will affect the prompt that VMind sends to the large language model, determining whether to add the thinking process to the output results when completing tasks such as chart generation and data aggregation. `showThoughts = true` will make the model explicitly output its thinking process, improving the accuracy of the generated results. However, this will increase the length of the model-generated results, bringing more token consumption. When performing tasks such as chart generation, VMind must wait for the model output to end before proceeding to the next step, which will also slow down the execution speed of various VMind methods.

Therefore, if you expect better execution results, you can set showThoughts to true. If you want VMind to complete tasks such as chart generation and data aggregation with fewer tokens and faster speed, you can set this parameter to false.

In VMind, showThoughts defaults to true.

## Customizing the method of calling the LLM service through customRequestFunc

VMind calls the LLM service through the requestGPT method by HTTP request. However, you can customize the method of calling the LLM in each task through the customRequestFunc parameter. For example, you can request your own LLM service in the form of RPC.
This parameter has three requestFunc type values, the complete type definition is as follows:
```ts
type customRequestFunc= {
  chartAdvisor: requestFunc;
  dataProcess: requestFunc;
  dataQuery: requestFunc;
};

type requestFunc = (prompt: string, userMessage: string, options: ILLMOptions | undefined) => Promise<LLMResponse>;

export type LLMResponse = {
  choices: {
    index: number;
    message: any;
  }[];
  usage: any;
  [key: string]: any;
};
```

chartAdvisor, dataProcess, and dataQuery correspond to the methods of calling the LLM during chart generation, data processing, and data aggregation, respectively. Each method needs to receive the model prompt, user input, and VMind options as parameters, and ensure that the returned object is the same as the OpenAI completions API structure (see [The chat completion object](https://platform.openai.com/docs/api-reference/chat/object)).
Here is an example of using RPC for intelligent chart generation:
```ts
import VMind, { Model } from '@visactor/vmind'

const vmind = new VMind({
  model: Model.GPT3_5,
  customRequestFunc: {
    chartAdvisor: async (_prompt: string,
    userMessage: string,
    _options: ILLMOptions | undefined) => {
      const resp = await call_RPC_LLM_Service(_prompt, userMessage, _options)

      const { result } = resp
      const content = result.content.content
      const gptResponse = {
        usage: {}, //token usage information
        choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content //Put the model's generated results into content
        }
        }]
      }
      return gptResponse //return chat completion object, see https://platform.openai.com/docs/api-reference/chat/object
    }
  }
})

const { spec } = await vmind.generateChart(userInput, fieldInfo, dataset); //Call generateChart for chart generation

```

# Conclusion
This tutorial details how to create a VMind instance and how to set various parameters to meet different needs. We learned how to specify the url of the model service, how to set headers for authentication, how to choose the model type, and how to set the maximum token quantity and temperature of the model-generated content. We also learned how to control whether the model adds the thinking process to the output results through the showThoughts parameter, and how to customize the method of calling the LLM service through the customRequestFunc parameter.

Through this tutorial, you can not only learn how to create and configure VMind instances, but also understand how to adjust and optimize the use of VMind according to your own needs and environment, so as to more effectively use VMind to complete various tasks, including chart generation, data processing, and data aggregation, etc.
