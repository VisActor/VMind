# 自定义大语言模型(LLM)调用方式
在前面的章节中，我们已经提到，VMind在进行[数据处理](./Data_Process.md)、[数据聚合](./Data_Aggregation.md)和[图表生成](./Chart_Generation.md)的过程中，都会调用大语言模型(LLM)。默认情况下，我们是通过HTTP请求的方式来调用LLM的，你可以在[初始化VMind实例](./Create_VMind_Instance.md)时，通过指定LLM服务的url和设置header来完成鉴权。

然而，在某些特殊情况下，你可能需要自定义LLM服务的调用方式。比如，你可能想通过RPC方式来请求服务，或者你可能想在模型返回结果后进行一些额外的处理，然后再将处理后的结果返回给VMind。为了满足这些需求，我们提供了一个在初始化VMind对象时设置`customRequestFunc`对象的选项，你可以通过这个选项来自定义LLM服务在不同阶段的调用方式。

`customRequestFunc`的类型定义如下：

```ts
type customRequestFunc= {
chartAdvisor: RequestFunc; //图表生成阶段
dataProcess: RequestFunc; //数据处理阶段
dataQuery: RequestFunc; //数据聚合阶段
};

type RequestFunc = (prompt: string, userPrompt: string, options: ILLMOptions | undefined) => Promise<LLMResponse>;

type LLMResponse = {
  choices: {
    index: number;
    message: any;
  }[];
  usage: any;
  [key: string]: any;
};

```

`customRequestFunc`对象有三个属性：`chartAdvisor`，`dataProcess`和`dataQuery`，它们分别对应VMind中的图表生成(`vmind.generateChart`)，数据处理(`vmind.parseCSVDataWithLLM`)和数据聚合(`vmind.dataQuery`)三个功能。每个属性都是一个`RequestFunc`类型的函数，这个函数的参数分别是模型执行任务时的提示信息`prompt`，用户输入的展示意图`userPrompt`和`options`对象。当VMind在请求LLM服务时，会调用你自定义的函数，并将这三个参数传入。你需要在自定义的函数中使用`prompt`和`userPrompt`来请求LLM服务，并按照`LLMResponse`的格式返回模型的生成结果。`LLMResponse`的结构与OpenAI completions API的结构相同（详情请见[The chat completion object](https://platform.openai.com/docs/api-reference/chat/object)）。

需要注意的是，`customRequestFunc`中的函数都是异步函数，VMind会使用`await`来等待模型请求的结束。

下面是一个在图表生成过程中使用RPC调用LLM服务的示例：

```ts
import VMind, { Model } from '@visactor/vmind'

//自定义一个RequestFunc类型的函数
const ChartGenerationRequestFunc = async (prompt: string, userMessage: string, options: ILLMOptions | undefined) => {
      //使用prompt，userMessage和options， 通过RPC调用LLM服务
      const resp = await call_RPC_LLM_Service(prompt, userMessage, options)

      const { result } = resp
      const content = result.content //获取模型生成的结果
      const gptResponse = {
        usage: {}, //token使用信息
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

const vmind = new VMind({
  model: Model.GPT3_5,
  customRequestFunc: {
    chartAdvisor: ChartGenerationRequestFunc //将自定义函数传递给chartAdvisor
  }
})

const { spec } = await vmind.generateChart(userInput, fieldInfo, dataset); //调用generateChart进行图表生成

```
