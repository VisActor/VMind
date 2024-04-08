export interface IPrompt<T> {
  readonly template: string;
  readonly context: T;
  getPrompt: () => string;
}
