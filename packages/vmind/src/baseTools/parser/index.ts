import { IParser } from './types';

export class Parser<T> implements IParser<T> {
  input: string;
  output: T;
  constructor(input: string) {
    this.input = input;
  }

  parse() {
    return this.input as T;
  }
}
