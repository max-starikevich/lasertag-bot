import { Server } from 'http'
import axios from 'axios'
import debug from 'debug'
import { Chat, Message, User, WebhookInfo } from 'telegraf/typings/core/types/typegram'

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { ParsedUrlQuery } from 'querystring'

import { ITelegramClient } from './types'

const log = debug('telegraf:test')

interface TelegramTestParams {
  botWebhookUrl: string
  port: number
  token: string
}

export class TelegrafTest implements ITelegramClient {
  options: TelegramTestParams = {
    botWebhookUrl: 'http://127.0.0.1:3000/secret-path',
    port: 2000,
    token: 'ABCD:1234567890'
  }

  updateId = 1

  me: User = {
    id: 2,
    is_bot: false,
    first_name: 'Me'
  }

  bot: User = {
    id: 1,
    is_bot: true,
    first_name: 'Bot'
  }

  user: User = {
    id: 2,
    is_bot: false,
    first_name: 'User'
  }

  chat: Chat.PrivateChat = {
    id: 1,
    type: 'private',
    username: 'chat-username',
    first_name: 'chat-firstname',
    last_name: 'chat-lastname'
  }

  message: Message.TextMessage = {
    message_id: 1,
    from: this.user,
    chat: this.chat,
    text: 'test text for test message',
    date: Date.now(),
    edit_date: Date.now()
  }

  webhookInfo: WebhookInfo = {
    has_custom_certificate: false,
    pending_update_count: 0
  }

  koa?: Koa
  server?: Server
  webhook: any

  constructor (optionsInput?: TelegramTestParams) {
    this.options = {
      ...this.options,
      ...optionsInput
    }

    this.updateId = 0

    this.setWebhook({
      url: this.options.botWebhookUrl
    })
  }

  setMe (meInput: Partial<User>): User {
    this.me = {
      ...this.me,
      ...meInput
    }

    return this.me
  }

  getMe (): User {
    return this.me
  }

  setWebhook (webhookInfoInput: Partial<WebhookInfo>): WebhookInfo {
    this.webhookInfo = {
      ...this.webhookInfo,
      ...webhookInfoInput
    }

    return this.webhookInfo
  }

  getWebhook (): WebhookInfo {
    return this.webhookInfo
  }

  setBot (botInput: Partial<User>): User {
    this.bot = {
      ...this.bot,
      ...botInput
    }

    return this.bot
  }

  getBot (): User {
    return this.bot
  }

  setUser (userInput: Partial<User>): User {
    this.user = {
      ...this.user,
      ...userInput
    }

    return this.user
  }

  getUser (): User {
    return this.user
  }

  setChat (chatInput: Partial<Chat.PrivateChat>): Chat.PrivateChat {
    this.chat = {
      ...this.chat,
      ...chatInput
    }

    return this.chat
  }

  getChat (): Chat.PrivateChat {
    return this.chat
  }

  setMessage (messageInput: Partial<Message.TextMessage>): Message.TextMessage {
    const messageId = this.message.message_id + 1

    this.message = {
      ...this.message,
      ...messageInput,
      message_id: messageId,
      from: this.user,
      chat: this.chat,
      date: Date.now(),
      edit_date: Date.now()
    }

    return this.message
  }

  getMessage (): Message.TextMessage {
    return this.message
  }

  async sendUpdate (update: any): Promise<void> {
    this.updateId++

    return await axios({
      method: 'POST',
      url: this.options.botWebhookUrl,
      headers: {
        'content-type': 'application/json'
      },
      data: {
        update_id: this.updateId,
        ...update
      }
    })
  }

  async sendMessage (messageInput: Partial<Message.TextMessage>): Promise<void> {
    const message = this.setMessage({
      ...messageInput
    })

    return await this.sendUpdate({ message: { ...message, edit_date: undefined } })
  }

  async startServer (): Promise<void> {
    const app = new Koa()
    const router = new Router()

    app.use(bodyParser())

    router.get('/', (ctx) => {
      ctx.body = 'OK'
    })

    router.post('/', (ctx) => {
      ctx.body = 'OK'
    })

    const methods: { [key: string]: (query: ParsedUrlQuery) => Promise<any> } = {
      getMe: async () => {
        return {
          ok: true,
          result: {
            ...this.bot
          }
        }
      },

      setWebhook: async (query) => {
        const output = {
          ok: true,
          result: true,
          description: 'Webhook is already deleted'
        }

        this.setWebhook(query)

        output.description = 'Webhook was set'

        return output
      },
      deleteWebhook: async () => {
        this.setWebhook({
          url: ''
        })
        return {
          ok: true,
          result: true,
          description: 'Webhook was deleted'
        }
      },
      getWebhookInfo: async () => {
        return {
          ok: true,
          result: {
            ...this.webhook
          }
        }
      },
      getChatMember: async () => {
        return {
          ok: true,
          result: {
            status: 'member',
            user: this.user
          }
        }
      },
      sendMessage: async (message: Partial<Message>) => {
        return {
          ok: true,
          result: await this.sendMessage({
            ...message
          })
        }
      }
    }

    const handleRequest = async (ctx: Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>): Promise<any> => {
      const { params, query } = ctx

      if (params.token !== this.options.token) {
        log('Request token doesn\'t match the server side one')
        return {
          ok: false,
          error_code: 401,
          description: 'Unauthorized'
        }
      }

      const methodName = params.method

      if (methodName === undefined) {
        log('Missing method name in the query')
        return {
          ok: false,
          error_code: 401,
          description: 'Not Found: missing method name in the query'
        }
      }

      const handler = methods[methodName]

      if (handler === undefined) {
        return {
          ok: false,
          error_code: 401,
          description: `Not Found: method "${methodName}" not found in Telegraf Test`
        }
      }

      log(`Method ${methodName}() exists. Calling it with query ${JSON.stringify(query)}`)

      return await handler(query)
    }

    router.get('/bot:token/:method', async ctx => {
      ctx.body = await handleRequest(ctx)
    })

    router.post('/bot:token/:method', async ctx => {
      ctx.body = await handleRequest(ctx)
    })

    app
      .use(router.routes())
      .use(router.allowedMethods())

    this.server = app.listen(this.options.port, () => {
      log('Telegraf Test Server running at port: ', this.options.port)
    })
  }

  async stopServer (): Promise<void> {
    this.server?.close()
  }
}
