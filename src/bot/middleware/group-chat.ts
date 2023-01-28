import { BotMiddleware } from '.'
import { GroupChatForbiddenError } from '../../errors/GroupChatForbiddenError'

export const groupChatMiddleware: BotMiddleware = async (ctx, next) => {
  if (ctx.isGroupChat && !ctx.isCreator) {
    throw new GroupChatForbiddenError()
  }

  return await next()
}
