import { Transformer } from '../transformer';

export interface IParser<DSL> {
  transformer: Transformer<string, unknown, DSL>;
  parse: (input: string) => DSL;
}
