export type Requester<Context> = (prompt: string, context: Context) => Promise<any>;
