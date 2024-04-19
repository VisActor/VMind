export enum ChatRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}
export type Chat = {
  index: number;
  role: ChatRole;
  content: string;
};
