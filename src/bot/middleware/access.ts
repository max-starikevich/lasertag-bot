import { MiddlewareFn, NarrowedContext } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'

import config from '$/config'
import { NoHomeChatAccessError } from '$/errors/NoHomeChatAccessError'

import { GameContext } from '../types'

export const accessMiddleware: MiddlewareFn<NarrowedContext<GameContext, Update.MessageUpdate>> = async (ctx, next) => {
  try {
    await ctx.telegram.getChatMember(config.TELEGRAM_HOME_CHAT_ID, ctx.from.id)
  } catch (error) {
    throw new NoHomeChatAccessError(error)
  }

  return await next()
}