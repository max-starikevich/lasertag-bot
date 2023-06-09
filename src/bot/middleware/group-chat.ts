import { BotMiddleware } from '.'

export const groupChatMiddleware: BotMiddleware = async (ctx, next) => {
  if (ctx.isGroupChat) {
    return await ctx.reply(ctx.lang.GROUP_CHAT_WARNING({ botUsername: ctx.botInfo.username }))
  }

  return await next()
}
