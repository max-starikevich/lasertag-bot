import { config } from '$/config'
import { AccessDeniedError } from '$/errors/AccessDeniedError'

import { BotMiddleware } from '.'

export const accessMiddleware: BotMiddleware = async (ctx, next) => {
  try {
    if (ctx.chat === undefined || ctx.from === undefined) {
      throw new Error('Missing "ctx.chat" or "ctx.from"')
    }

    if (config.TELEGRAM_HOME_CHAT_ID === undefined) {
      throw new Error('Missing TELEGRAM_HOME_CHAT_ID')
    }

    const { status } = await ctx.telegram.getChatMember(config.TELEGRAM_HOME_CHAT_ID, ctx.from.id)

    ctx.memberStatus = status

    if (!['creator', 'member', 'administrator'].includes(status)) {
      throw new AccessDeniedError()
    }

    if (status === 'creator') {
      ctx.isCreatorOfHomeChat = true
      ctx.isAdminOfHomeChat = true
    }

    if (status === 'administrator') {
      ctx.isAdminOfHomeChat = true
    }

    ctx.isPrivateChat = ctx.chat.type === 'private'

    if (!ctx.isPrivateChat) {
      return
    }
  } catch (error) {
    if (error instanceof AccessDeniedError) {
      throw error
    }

    throw new AccessDeniedError(error)
  }

  return await next()
}
