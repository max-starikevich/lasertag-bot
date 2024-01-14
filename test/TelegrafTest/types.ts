import { Chat, Message, Update, User, WebhookInfo } from 'telegraf/typings/core/types/typegram'

export interface ITelegramClient {
  setBot: (botUser: Partial<User>) => User
  setMe: (me: Partial<User>) => User
  setChat: (chat: Partial<Chat.PrivateChat>) => Chat.PrivateChat
  setMessage: (textMessage: Partial<Message.TextMessage>) => Message.TextMessage
  setWebhook: (webhook: Partial<WebhookInfo>) => WebhookInfo

  getBot: () => User
  getMe: () => User
  getChat: () => Chat.PrivateChat
  getMessage: () => Message.TextMessage
  getWebhook: () => WebhookInfo

  sendUpdate: (textUpdate: Partial<Update.MessageUpdate<Message.TextMessage>>) => Promise<void>
  sendMessage: (textMessage: Partial<Message.TextMessage>) => Promise<void>

  startServer: () => Promise<void>
  stopServer: () => Promise<void>
}
