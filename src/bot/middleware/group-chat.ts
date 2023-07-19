import { BotMiddleware } from '.'

export const groupChatMiddleware: BotMiddleware = async (ctx, next) => {
  if ((ctx.chat == null) || (ctx.from == null)) {
    throw new Error('Missing "ctx.chat" and "ctx.from"')
  }

  ctx.isPrivateChat = ctx.chat.type === 'private'

  if (!ctx.isPrivateChat) {
    return
  }

  return await next()
}
