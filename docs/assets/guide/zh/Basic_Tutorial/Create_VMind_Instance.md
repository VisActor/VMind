# 创建VMind实例
要开始使用VMind智能可视化组件，首先你需要创建一个VMind实例。在创建VMind实例时，你需要传入一个options对象作为参数，这个对象中包含了一些关键的信息，例如模型的url，模型类型，以及LLM服务请求的headers等。
```ts
import VMind from '@visactor/vmind'

const vmind = new VMind(options)
```

options的完整类型定义如下：

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
在ILLMOptions中，大部分参数都会直接传递给LLM服务。

## GPT为例
如果你打算使用openAI官方提供的LLM服务，并通过headers中的openAI api key进行鉴权，你可以这样简单地初始化VMind：
```ts
import VMind, { Model } from '@visactor/vmind'

const vmind = new VMind({
  model: Model.GPT4o, //使用gpt-4o模型
  headers: { //指定调用LLM服务时的header
    Authorization: `Bearer ${OPENAI_API_KEY}` //Your OPENAI_API_KEY
  }
})
```

## DeepSeek为例
如果你打算使用deepSeek作为 LLM 服务，可以前往[DeepSeek官网](https://platform.deepseek.com/api_keys)注册属于你自己的 API key，注册完成后可以按照以下方式进行 VMind 的注册和使用，更详细内容可以参考[DeepSeek官方 API 文档](https://api-docs.deepseek.com/zh-cn/)
```ts
import VMind, { Model } from '@visactor/vmind'

const vmind = new VMind({
  url: 'https://api.deepseek.com/chat/completions' // DeepSeek 官方 url
  model: Model.DEEPSEEK_V3, // 使用DeepSeek-V3模型
  headers: { 
    Authorization: `Bearer ${DEEPSEEK_KEY}` //Your DEEPSEEK_KEY
  }
})
```

## 任意自定义模型
如果你想要使用其他任何大模型作为VMind的 LLM 服务，与前面例子相同，只需要将`url`和`model`改为你的模型服务地址，同步添加`headers`内容作为鉴权校验。具体如下：
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
在接下来的章节，我们将对ILLMOptions中的参数进行详细的解释。

## url
url参数用于指定你的LLM服务api的地址，默认值是https://api.openai.com/v1/chat/completions

在你使用VMind的过程中，所有需要调用LLM的地方都会向这个url发送http请求。

## headers
你可以通过headers参数来指定请求LLM服务时的http headers。最常见的用法是将你的api key放入headers中用作鉴权；当然，你也可以将任何你需要的字段放入headers中。

## method
method参数用于指定请求LLM时的方法类型，通常为POST。

## model
你可以通过model参数来指定模型种类。这个字段将被放入LLM服务的请求体中。你可以从VMind中引入Model类型并用作model字段的值。
```ts
import { Model } from '@visactor/vmind'
```

目前支持的模型种类有：
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

目前，VMind 对于所有的大模型都会使用相同的技术和prompt来完成各种智能任务.

## maxTokens和temperature
这两个参数分别决定模型生成内容的最大token数量和每次生成结果的随机性，详见[OpenAI官方文档](https://platform.openai.com/docs/api-reference/chat/create)。

在VMind中，这两个参数的默认值分别是2048和0。

## showThoughts
[相关研究](https://arxiv.org/abs/2201.11903)表明，思维链（Chain-of-Thought）可以增强大语言模型的思维推理能力，使输出的结果更加符合预期。showThoughts参数将影响VMind传给大语言模型的prompt，决定其在完成图表生成、数据聚合等任务时，是否将思考过程添加到输出结果中。`showThoughts = true`会使模型将其思考过程显式地输出，提高生成结果的准确性。然而，这会增加模型生成结果的长度，带来更多的token消耗。在执行图表生成等任务时，VMind必须等待模型输出结束后才能进行后续步骤，这也将减慢VMind各项方法的执行速度。

因此，如果你期望获得更好的执行效果，可以将showThoughts设置为true。如果你希望VMind能够以更少的token数量和更快的速度完成图表生成、数据聚合等任务，可以将这个参数设置为false。

在VMind中，showThoughts默认为true。

## 通过customRequestFunc自定义LLM服务调用方法

VMind默认通过LLM配置的地址，通过HTTP请求进行LLM服务的调用。然而，你可以通过customRequestFunc参数，自定义在每种任务中调用LLM的方法。例如，你可以通过RPC的形式请求你自己的LLM服务。
该参数有三个requestFunc类型的值，完整的类型定义如下：
```ts
type customRequestFunc= {
  chartAdvisor?: RequestFunc;
  dataQuery?: RequestFunc;
  dataExtraction?: RequestFunc;
  chartCommand?: RequestFunc;
  IntelligentInsight?: RequestFunc;
};

type RequestFunc = (
  messages: LLMMessage[],
  tools: ToolMessage[] | undefined,
  options: ILLMOptions | undefined
) => Promise<LLMResponse>;

/** LLM Messages api */
export interface LLMMessage {
  /** prompt role, system or user query or tool result */
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface LLMResponse {
  usage?: Usage;
  /** function call res */
  toolRes?: any;
  /** content */
  choices?: {
    index: number;
    message: any;
    finish_reason?: string;
  }[];
  error?: string;
  [key: string]: any;
}
```

chartAdvisor和dataQuery分别对应图表生成，数据处理和数据聚合时调用LLM的方法。每个方法需要接收传给大模型的Messages（详情见[messages](https://platform.openai.com/docs/api-reference/chat/create#chat-create-messages)）, function call配置（详情见[tools](https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools)）以及VMind options作为参数，并确保返回的对象与OpenAI completions API结构相同（详情请见[The chat completion object](https://platform.openai.com/docs/api-reference/chat/object)）。
下面展示一个使用RPC进行图表智能生成的例子：
```ts
import VMind, { Model } from '@visactor/vmind'

const vmind = new VMind({
  model: Model.GPT4o,
  customRequestFunc: {
    chartAdvisor: async (messages: LLMMessage[], tools: ToolMessage[] | undefined, _options: ILLMOptions | undefined) => {
      const resp = await call_RPC_LLM_Service(messages, tools, _options)

      const { result } = resp
      const content = result.content.content
      const gptResponse = {
        usage: {}, //token用量信息
        choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content //将模型的生成结果放入content中
      }
      }]
      }
      return gptResponse //返回chat completion object，见https://platform.openai.com/docs/api-reference/chat/object
    }
  }
})

const { spec } = await vmind.generateChart(userInput, fieldInfo, dataset); //调用generateChart进行图表生成

```

# 总结
本教程详细介绍了如何创建VMind实例，以及如何设置各种参数以满足不同的需求。我们学习了如何指定模型服务的url，如何设置headers以进行鉴权，如何选择模型类型，以及如何设置模型生成内容的最大token数量和temperature。我们还了解了如何通过showThoughts参数来控制模型是否将思考过程添加到输出结果中,以及如何通过customRequestFunc参数来自定义LLM服务的调用方法。

通过本教程，你不仅可以学会如何创建和配置VMind实例，更了解了如何根据自己的需求和环境来调整和优化VMind的使用，从而更有效地利用VMind来完成各种任务，包括图表生成、数据处理和数据聚合等。
