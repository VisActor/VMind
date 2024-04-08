import { IParser } from './types';

export class Parser<T> implements IParser<T> {
  parse(input: string) {
    return input as T;
  }
}
