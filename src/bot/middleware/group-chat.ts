import { BotMiddleware } from '.'

export const groupChatMiddleware: BotMiddleware = async (ctx, next) => {
  if (ctx.isGroupChat) {
    await ctx.reply(ctx.lang.GROUP_CHAT_WARNING({ botUsername: ctx.botInfo.username }), {
      reply_to_message_id: ctx.message?.message_id
    })

    return
  }

  return await next()
}
