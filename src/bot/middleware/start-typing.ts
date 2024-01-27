import { BotMiddleware } from '.'

export const startTypingMiddleware: BotMiddleware = async (ctx, next) => {
  if (ctx.chat === undefined) {
    throw new Error('Missing "ctx.chat"')
  }

  await ctx.telegram.sendChatAction(ctx.chat.id, 'typing')

  return await next()
}
