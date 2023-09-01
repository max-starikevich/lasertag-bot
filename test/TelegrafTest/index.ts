import { Server } from 'http'
import axios from 'axios'
import debug from 'debug'
import { Message } from 'telegraf/typings/core/types/typegram'

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { ParsedUrlQuery } from 'querystring'

const log = debug('telegraf:test')

interface TelegramTestParams {
  botWebhookUrl: string
  port: number
  token: string
}

export class TelegrafTest {
  options: TelegramTestParams

  updateId: number
  bot: any
  user: any
  chat: any
  message?: Message
  inline_query: any
  callback_query: any
  webhook: any

  allowedUpdates = [
    'message',
    'channel_post',
    'edited_channel_post',
    'inline_query',
    'chosen_inline_result',
    'callback_query',
    'shipping_query',
    'pre_checkout_query'
  ]

  koa?: Koa
  server?: Server

  constructor (optionsInput?: TelegramTestParams) {
    this.options = {
      botWebhookUrl: 'http://127.0.0.1:3000/secret-path',
      port: 2000,
      token: 'ABCD:1234567890',
      ...optionsInput
    }

    this.updateId = 0

    this.setBot({})
    this.setUser({})
    this.setChat({})
    this.setMessage({})
    this.setInlineQuery({})
    this.setCallbackQuery({})

    this.setWebhook({
      url: this.options.botWebhookUrl
    })
  }

  // Methods start in set**
  setBot (bot: any) {
    this.bot = {
      id: 1234,
      is_bot: true,
      first_name: 'BOT',
      username: 'bot',
      ...this.bot,
      ...bot
    }
    log('New bot', this.bot)
    return this.bot
  }

  setUser (user: any) {
    this.user = {
      id: 1234567890,
      is_bot: false,
      first_name: 'FIST-NAME',
      last_name: '',
      username: 'USERNAME',
      language_code: 'en-US',
      ...this.user,
      ...user
    }
    log('New user', this.user)
    return this.user
  }

  setChat (chat: any) {
    this.chat = {
      id: 1234567890,
      type: 'private', // “private”, “group”, “supergroup” or “channel”
      title: 'TITLE',
      username: 'USERNAME',
      first_name: 'FIST-NAME',
      last_name: 'LAST-NAME',
      all_members_are_administrators: false,
      ...this.chat,
      ...chat
    }
    log('New chat', this.chat)
    return this.chat
  }

  setMessage (message: Partial<Message>): Message {
    const messageId = this.message?.message_id != null ? this.message.message_id + 1 : 1

    this.message = {
      message_id: messageId,
      from: this.user,
      chat: this.chat,
      date: Date.now(),
      ...message
    }

    return this.message
  }

  setInlineQuery (inlineQuery: any) {
    let id = 1
    if (this.inline_query && this.inline_query.id) {
      id = Math.floor(id) + 1
    }

    this.inline_query = {
      id,
      from: this.user,
      query: '',
      offset: '',
      ...inlineQuery
    }
    return this.inline_query
  }

  setCallbackQuery (callbackQuery: any) {
    let id = 1
    if (this.callback_query && this.callback_query.id) {
      id = Math.floor(id) + 1
    }

    this.callback_query = {
      id,
      from: this.user,
      ...callbackQuery
    }
    return this.callback_query
  }

  setUpdateId (id: number) {
    this.updateId = Math.floor(id)
    log('New update id', this.updateId)
    return this.updateId
  }

  setWebhook (webhook: any) {
    this.webhook = {
      url: '',
      has_custom_certificate: false,
      pending_update_count: 0,
      last_error_date: `${Number(new Date())}`,
      last_error_message: 'Init Telegraf Test',
      max_connections: 40,
      allowed_updates: [
        ...this.allowedUpdates
      ],
      ...this.webhook,
      ...webhook
    }
    log('New webhook info', this.webhook)
    return this.webhook
  }

  setAllowedUpdates (updates: string[]) {
    if (updates.length > 0) {
      this.allowedUpdates = updates
    }

    log('New allowedUpdates', this.allowedUpdates)
    return this.allowedUpdates
  }

  // Methods start in get**
  getBot () {
    return this.bot
  }

  getUser () {
    return this.user
  }

  getChat () {
    return this.chat
  }

  getMessage () {
    return this.message
  }

  getInlineQuery () {
    return this.inline_query
  }

  getCallbackQuery () {
    return this.callback_query
  }

  getUpdateId () {
    return this.updateId
  }

  getWebhook () {
    return this.webhook
  }

  getAllowedUpdates () {
    return this.allowedUpdates
  }

  // Methods start in send**
  async sendUpdate (update: any) {
    this.updateId++
    let ignored = true
    for (const updateType of this.allowedUpdates) {
      if (update[updateType]) {
        ignored = false
      }
    }

    if (ignored) {
      log('Update ignored (check getAllowedUpdates()) ', {
        update_id: this.updateId,
        ...update
      })
      return false
    }

    log('Send via WebHook ', {
      update_id: this.updateId,
      ...update
    })

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

  async sendMessage (messageInput: Partial<Message>) {
    const message = this.setMessage({
      ...messageInput
    })
    return await this.sendUpdate({ message })
  }

  async sendMessageWithText (text: string, options = {}) {
    const message = this.setMessage({
      text,
      ...options
    })
    return await this.sendUpdate({ message })
  }

  async sendInlineQuery (query: string, options = {}) {
    const inlineQuery = this.setInlineQuery({
      query,
      ...options
    })
    return await this.sendUpdate({ inline_query: inlineQuery })
  }

  async sendCallbackQuery (options = {}) {
    const callbackQuery = this.setCallbackQuery({
      ...options
    })
    return await this.sendUpdate({ callback_query: callbackQuery })
  }

  async sendCallbackQueryWithData (data: any, options = {}) {
    const callbackQuery = this.setCallbackQuery({
      data,
      message: this.message,
      ...options
    })
    return await this.sendUpdate({ callback_query: callbackQuery })
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
