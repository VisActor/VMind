import { Transformer } from '../transformer';

/**
 * Sometimes the DSL generated by LLM may has some errors and need to be patched
 * Patcher is responsible for completing the patch of DSL generated by LLM
 * pipelines is composed of a series of transformer, completing the conversion of initial DSL to final DSL
 * patch method is responsible for executing pipelines, patch the input based on Context, and return the final DSL
 * pass the specific pipelines during initialization
 */

export type Patcher<Context, Output> = Transformer<Context & Output, Output>[];
