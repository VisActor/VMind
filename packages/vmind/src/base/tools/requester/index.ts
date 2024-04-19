export type Requester<Context> = (prompt: string, userMessage: string, context: Context) => Promise<any>;
