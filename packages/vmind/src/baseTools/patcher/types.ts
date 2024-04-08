import { Transformer } from '../transformer';
export interface IPatcher<T, C> {
  input: T;
  output: T;
  pipelines: Transformer<T, C, T>[];
  context: C;
  patch: () => T;
}
