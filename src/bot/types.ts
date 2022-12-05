import { Context, NarrowedContext } from 'telegraf'
import { Message, Update } from 'telegraf/typings/core/types/typegram'

import { IGame } from '$/game/types'
import { ILogger } from '$/logger/types'

export interface GameContext extends Context {
  game: IGame
  logger: ILogger
  isAdmin: boolean
}

export type CommandHandler = (ctx: NarrowedContext<GameContext, Update.MessageUpdate<Message.TextMessage>>) => Promise<Message.TextMessage>

export interface Command {
  name: string
  handler: CommandHandler
  description: string
  showInMenu: boolean
  requireDocument: boolean
}
