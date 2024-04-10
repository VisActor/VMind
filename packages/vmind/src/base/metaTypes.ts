import { ModelType } from 'src/typings';
import { TaskNodeType } from './taskNode/types';
import { Parser } from './tools/parser';
import { Patcher } from './tools/patcher';
import { Prompt } from './tools/prompt';
import { Requester } from './tools/requester';
import { Transformer } from './tools/transformer';
export type LLMBasedTaskNodeMeta<Context, Output> = {
  type: TaskNodeType.LLM_BASED;
  modelType: ModelType;
  parser: Parser<any, Output>;
  patcher: Patcher<Context, Output>;
  prompt: Prompt<Context>;
  requester: Requester<Context>;
};

export type RuleBasedTaskNodeMeta<Context, Result> = {
  type: TaskNodeType.RULE_BASED;
  pipelines: Transformer<any, Context, any>[];
};

export type TaskNodeMeta<Context, Output> =
  | LLMBasedTaskNodeMeta<Context, Output>
  | RuleBasedTaskNodeMeta<Context, Output>;

export type TaskNode<Context> = {
  name: string;
  taskNode: TaskNodeMeta<Context, any>;
};

export type ApplicationMeta<Input, Output> = {
  name: string;
  taskNodes: TaskNode<any>[];
};
