export interface IParser<T> {
  input: string;
  output: T;
  parse: () => T;
}
