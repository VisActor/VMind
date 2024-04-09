import { Transformer } from '../transformer';

export interface IParser<DSL> {
  transformer: Transformer<string, null, DSL>;
  parse: (input: string) => DSL;
}
