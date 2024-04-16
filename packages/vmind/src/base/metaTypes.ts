import { ModelType } from 'src/typings';
import { TaskNodeType } from './taskNode/types';
import { Parser } from './tools/parser';
import { Patcher } from './tools/patcher';
import { Prompt } from './tools/prompt';
import { Requester } from './tools/requester';
import { Transformer } from './tools/transformer';

/**
 * meta used to describe LLM-based task node (see LLMBasedTaskNode class)
 */
export type LLMBasedTaskNodeMeta<Context, Output> = {
  type: TaskNodeType.LLM_BASED;
  modelType: ModelType;
  parser: Parser<any, Partial<Output>>;
  patcher: Patcher<any, Partial<Output>>;
  prompt: Prompt<Context>;
  requester: Requester<Context>;
};

/**
 * meta used to describe rule-based task node (see RuleBasedTaskNode)
 */
export type RuleBasedTaskNodeMeta<Context, Result> = {
  type: TaskNodeType.RULE_BASED;
  pipelines: Transformer<any, any>[] | ((context: Context) => Transformer<any, any>[]);
};

export type TaskNodeMeta<Context, Output> =
  | LLMBasedTaskNodeMeta<Context, Output>
  | RuleBasedTaskNodeMeta<Context, Output>;

export type TaskNode<Context> = {
  name: string;
  taskNode: TaskNodeMeta<Context, any>;
};

/**
 * meta used to describe an application (see BaseApplication class)
 * metas will be registered in the constructor of BaseApplication
 */
export type ApplicationMeta<Input, Output> = {
  name: string;
  taskNodes: TaskNode<any>[];
};
