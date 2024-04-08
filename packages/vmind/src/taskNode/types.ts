export interface ITaskNode<Context, DSL> {
  context: Context;
  output: DSL;
  executeTask: (() => Promise<Awaited<DSL>>) | (() => DSL);
}
export type RequestFunc = (
  prompt: string,
  userMessage: string,
  options: ILLMOptions | undefined
) => Promise<LLMResponse>;

//models that VMind support
//more models is under developing
export enum Model {
  GPT3_5 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4',
  SKYLARK = 'skylark-pro',
  SKYLARK2 = 'skylark2-pro-4k',
  CHART_ADVISOR = 'chart-advisor'
}

export interface ILLMOptions {
  url?: string; //URL of your LLM service. For gpt, default is openAI API.
  /** llm request header, which has higher priority */
  headers?: HeadersInit; // this will be used directly as the header of the LLM request.
  method?: 'POST' | 'GET'; //post or get
  model?: Model | string;
  max_tokens?: number;
  temperature?: number;
  showThoughts?: boolean;
  customRequestFunc?: {
    chartAdvisor?: RequestFunc;
    dataProcess?: RequestFunc;
    dataQuery?: RequestFunc;
  };
  [key: string]: any;
}
