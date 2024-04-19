import { Chat, ChatRole } from './types';

/**
 * ChatManager for multiple-rounds dialogue management
 */
export class ChatManager {
  chatList: Chat[];

  constructor() {
    this.chatList = [];
  }

  addChat(content: string, role: ChatRole) {
    const chatNum = this.chatList.length;
    this.chatList.push({
      content,
      role,
      index: chatNum
    });
  }

  getLatestUserMessage() {
    return this.chatList.find(chat => chat.role === ChatRole.USER);
  }
}
