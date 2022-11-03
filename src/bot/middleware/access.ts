import { MiddlewareFn, NarrowedContext } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'

import config from '$/config'
import { NoHomeChatAccessError } from '$/errors/NoHomeChatAccessError'

import { GameContext } from '../types'

export const accessMiddleware: MiddlewareFn<NarrowedContext<GameContext, Update.MessageUpdate>> = async (ctx, next) => {
  try {
    const { status } = await ctx.telegram.getChatMember(config.TELEGRAM_HOME_CHAT_ID, ctx.from.id)
    
    if (!['creator', 'member', 'administrator'].includes(status)) {
      throw new NoHomeChatAccessError(`This member isn't a member of the group`)
    }
  } catch (error) {
    if (error instanceof NoHomeChatAccessError) {
      throw error
    }

    throw new NoHomeChatAccessError(error)
  }

  return await next()
}
