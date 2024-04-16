export interface IPrompt<Context> {
  readonly template: string;
  getSystemPrompt: (context: Context) => string;
  getUserPrompt: (context: Context) => string;
}
