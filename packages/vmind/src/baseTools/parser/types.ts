export interface IParser<T> {
  parse: (input: string) => T;
}
