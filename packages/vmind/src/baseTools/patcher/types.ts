import { Transformer } from '../transformer';
export interface IPatcher<T, C> {
  pipelines: Transformer<Partial<T>, C, T>[];
  patch: (input: Partial<T>, context: C) => T;
}
