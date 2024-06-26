
# Customizing Large Language Model (LLM) Invocation Method
In previous chapters, we have mentioned that VMind calls the Large Language Model (LLM) during the processes of [data processing](./Data_Process), [data aggregation](./Data_Aggregation), and [chart generation](./Chart_Generation). By default, we call the LLM via HTTP requests. You can specify the URL of the LLM service and set the header for authentication when [initializing the VMind instance](./Create_VMind_Instance).

However, in some special cases, you may need to customize the way the LLM service is called. For example, you may want to request the service via RPC, or you may want to do some extra processing after the model returns the results, and then return the processed results to VMind. To meet these needs, we provide an option to set the `customRequestFunc` object when initializing the VMind object. You can use this option to customize the way the LLM service is called at different stages.

The type definition of `customRequestFunc` is as follows:

```ts
type customRequestFunc= {
  chartAdvisor: RequestFunc; // Chart generation stage
  dataQuery: RequestFunc; // Data aggregation stage
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

The `customRequestFunc` object has two properties: `chartAdvisor` and `dataQuery`, which correspond to the three functions of chart generation (`vmind.generateChart`) and data aggregation (`vmind.dataQuery`) in VMind. Each property is a function of type `RequestFunc`, the parameters of which are the prompt information `prompt`, the user input display intention `userPrompt`, and the `options` object when the model executes the task. When VMind requests the LLM service, it will call your custom function and pass these three parameters. You need to use `prompt` and `userPrompt` to request the LLM service in your custom function and return the model's generated results in the format of `LLMResponse`. The structure of `LLMResponse` is the same as that of the OpenAI completions API (for details, see [The chat completion object](https://platform.openai.com/docs/api-reference/chat/object)).

Note that the functions in `customRequestFunc` are asynchronous, and VMind will use `await` to wait for the end of the model request.

Below is an example of using RPC to call the LLM service during the chart generation process:

```ts
import VMind, { Model } from '@visactor/vmind'

// Custom a RequestFunc type function
const ChartGenerationRequestFunc = async (prompt: string, userMessage: string, options: ILLMOptions | undefined) => {
// Use prompt, userMessage, and options to call the LLM service via RPC
const resp = await call_RPC_LLM_Service(prompt, userMessage, options)

const { result } = resp
const content = result.content // Get the results generated by the model
const gptResponse = {
  usage: {}, // Token usage information
  choices: [{
  index: 0,
  message: {
    role: 'assistant',
    content // Put the results generated by the model into content
}
}]
}
return gptResponse // Return chat completion object, see https://platform.openai.com/docs/api-reference/chat/object
}

const vmind = new VMind({
  model: Model.GPT3_5,
  customRequestFunc: {
    chartAdvisor: ChartGenerationRequestFunc // Pass the custom function to chartAdvisor
}
})

const { spec } = await vmind.generateChart(userInput, fieldInfo, dataset); // Call generateChart for chart generation

```
