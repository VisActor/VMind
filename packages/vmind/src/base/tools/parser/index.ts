import { IParser } from './types';
import { Transformer } from '../transformer';

/**
 * Parser is responsible for parsing the string content generated by LLM into DSL in a specific format (JSON or YAML)
 * Use a transformer to complete the conversion from string to DSL
 * Pass in the transformer during initialization
 */
export class Parser<DSL> implements IParser<DSL> {
  transformer: Transformer<string, null, DSL>;

  constructor(transformer: Transformer<string, null, DSL>) {
    this.transformer = transformer;
  }

  parse(input: string) {
    return this.transformer.transform(input, null);
  }
}
