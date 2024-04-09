export interface IPrompt<Context> {
  readonly template: string;
  getPrompt: (context: Context) => string;
}
