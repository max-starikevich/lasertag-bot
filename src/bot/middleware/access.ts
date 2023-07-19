import config from '$/config'
import { AccessDeniedError } from '$/errors/AccessDeniedError'

import { BotMiddleware } from '.'

export const accessMiddleware: BotMiddleware = async (ctx, next) => {
  try {
    if ((ctx.chat == null) || (ctx.from == null)) {
      throw new Error('Missing "ctx.chat" and "ctx.from"')
    }

    const { status } = await ctx.telegram.getChatMember(config.TELEGRAM_HOME_CHAT_ID, ctx.from.id)

    ctx.memberStatus = status

    if (!['creator', 'member', 'administrator'].includes(status)) {
      throw new AccessDeniedError()
    }

    if (status === 'creator') {
      ctx.isCreatorOfHomeChat = true
      ctx.isAdminInHomeChat = true
    }

    if (status === 'administrator') {
      ctx.isAdminInHomeChat = true
    }
  } catch (error) {
    if (error instanceof AccessDeniedError) {
      throw error
    }

    throw new AccessDeniedError(error)
  }

  return await next()
}
