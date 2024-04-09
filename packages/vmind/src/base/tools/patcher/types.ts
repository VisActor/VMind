import { Transformer } from '../transformer';

export interface IPatcher<DSL, Context> {
  pipelines: Transformer<Partial<DSL>, Context, DSL>[];
  patch: (input: Partial<DSL>, context: Context) => DSL;
}
