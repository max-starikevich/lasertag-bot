import config from '$/config'
import { NoHomeChatAccessError } from '$/errors/NoHomeChatAccessError'

import { BotMiddleware } from '.'

export const accessMiddleware: BotMiddleware = async (ctx, next) => {
  try {
    const { status } = await ctx.telegram.getChatMember(config.TELEGRAM_HOME_CHAT_ID, ctx.from.id)

    if (!['creator', 'member', 'administrator'].includes(status)) {
      throw new NoHomeChatAccessError('This member isn\'t a member of the group')
    }

    if (['creator'].includes(status)) {
      ctx.isCreator = true
      ctx.isAdmin = true
    }

    if (['administrator'].includes(status)) {
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
