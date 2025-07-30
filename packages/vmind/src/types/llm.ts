import type { AtomName, BaseContext } from './atom';

/** LLM Model Type */
export enum ModelType {
  GPT3_5 = 'gpt3.5',
  GPT4 = 'gpt4',
  doubao = 'doubao',
  CHART_ADVISOR = 'chart-advisor'
}

/** Specific LLM MODEL */
export enum Model {
  GPT3_5 = 'gpt-3.5-turbo',
  GPT3_5_1106 = 'gpt-3.5-turbo-1106',
  GPT4 = 'gpt-4',
  GPT_4_0613 = 'gpt-4-0613',
  GPT_4o = 'gpt-4o-2024-08-06',
  DOUBAO_LITE = 'doubao-lite-32K',
  DOUBAO_PRO = 'doubao-pro-128k',
  DOUBAO_PRO_32K = 'doubao-pro-32k-240828',
  CHART_ADVISOR = 'chart-advisor',
  DEEPSEEK_V3 = 'deepseek-chat',
  DEEPSEEK_R1 = 'deepseek-reasoner'
}

/** Custrom Request function callback of llm */
export type RequestFunc = (
  messages: LLMMessage[],
  tools: ToolMessage[] | undefined,
  options: ILLMOptions | undefined
) => Promise<LLMResponse>;

/** Base LLM Options */
interface BaseLLMOptions {
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
  /** function call */
  functionCall?: 'auto' | 'none' | { name: string };

  // 支持添加thinking等模型自定义参数
  customConfig?: Record<string, any>;
}

/** LLM Options */
export interface ILLMOptions extends BaseLLMOptions {
  /** customRequest */
  customRequestFunc?: {
    [key in AtomName]?: RequestFunc;
  };
}

/** VMind Options */
export interface VMindOptions extends BaseLLMOptions {
  customRequestFunc?: {
    chartAdvisor?: RequestFunc;
    dataQuery?: RequestFunc;
    dataExtraction?: RequestFunc;
    chartCommand?: RequestFunc;
    IntelligentInsight?: RequestFunc;
  };
}

/** Tool Messages of tool result */
export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export type LLMContentItem = { type: 'image_url'; image_url: { url: string } } | { type: 'text'; text: string };

/** LLM Messages api */
export interface LLMMessage {
  /** prompt role, system or user query or tool result */
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | LLMContentItem[];
  name?: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export type ParamType = 'function' | 'object' | 'array' | 'string' | 'number' | 'boolean';
export interface JsonSchemaParams {
  type: ParamType;
  description?: string;
  enum?: string[];
  properties?: JsonSchemaParams;
  required?: string[];
  items?: JsonSchemaParams;
  minItems?: number;
  uniqueItems?: boolean;
  $ref?: string;
}

export interface ToolMessage {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters?: {
      type: string;
      properties: Record<string, JsonSchemaParams>;
      strict?: boolean;
      required?: string[];
      addionalProperties?: boolean;
    };
  };
}

/** LLM Response API */
export interface LLMResponse extends BaseContext {
  choices?: {
    index: number;
    message: any;
    finish_reason?: string;
  }[];
  error?: string;
  [key: string]: any;
}

export interface MemoryOptions {
  /** max history messages saved */
  maxMessagesCnt?: number;
}

export interface ILLMManage {
  options: ILLMOptions;
  historys: Record<string, BaseContext[]>;

  getDefaultOptions: () => ILLMOptions;
  updateOptions: (options: ILLMOptions) => void;
  run: (name: AtomName, messages: LLMMessage[], tools?: ToolMessage[]) => Promise<LLMResponse | { error: any }>;
  parseTools: (res: LLMResponse) => { error?: any; toolCalls?: any[] };
  parseJson: (res: LLMResponse) => { error?: any; [key: string]: any };
}
