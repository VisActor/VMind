import type { BaseContext } from './atom';

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
  GPT_4o = 'gpt-4o-2024-05-13',
  DOUBAO_LITE = 'doubao-lite-32K',
  DOUBAO_PRO = 'doubao-pro-32k',
  SKYLARK2 = 'skylark2-pro-4k',
  SKYLARK2_v1_2 = 'skylark2-pro-4k-v1.2',
  CHART_ADVISOR = 'chart-advisor'
}

/** LLM Options */
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
  /** show llm thoughs or not */
  showThoughts?: boolean;
  /** repetition penalty */
  frequency_penalty?: number;
}

/** LLM Messages api */
export interface LLMMessage {
  /** prompt role, system or user query */
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** LLM Response API */
export interface LLMResponse extends BaseContext {
  choices?: {
    index: number;
    message: any;
  }[];
  usage?: any;
  error?: string;
  [key: string]: any;
}
