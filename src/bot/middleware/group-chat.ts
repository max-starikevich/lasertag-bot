import { BotMiddleware } from '.'

export const groupChatMiddleware: BotMiddleware = async (ctx, next) => {
  if (ctx.isGroupChat && !ctx.isCreator) {
    await ctx.reply(ctx.lang.GROUP_CHAT_WARNING(), {
      reply_to_message_id: ctx.message?.message_id
    })

    return
  }

  return await next()
}
