import config from '$/config'
import { NoHomeChatAccessError } from '$/errors/NoHomeChatAccessError'

import { BotMiddleware } from '.'

export const accessMiddleware: BotMiddleware = async (ctx, next) => {
  try {
    if ((ctx.chat == null) || (ctx.from == null)) {
      throw new Error('Missing "ctx.chat" and "ctx.from"')
    }

    ctx.isGroupChat = ctx.chat.type === 'supergroup' || ctx.chat.type === 'group'
    ctx.isPrivateChat = ctx.chat.type === 'private'

    const { status } = await ctx.telegram.getChatMember(config.TELEGRAM_HOME_CHAT_ID, ctx.from.id)

    ctx.memberStatus = status

    if (!['creator', 'member', 'administrator'].includes(status)) {
      throw new NoHomeChatAccessError()
    }

    if (status === 'creator') {
      ctx.isCreator = true
      ctx.isAdmin = true
    }

    if (status === 'administrator') {
      ctx.isAdmin = true
    }
  } catch (error) {
    if (error instanceof NoHomeChatAccessError) {
      throw error
    }

    throw new NoHomeChatAccessError(error)
  }

  return await next()
}
