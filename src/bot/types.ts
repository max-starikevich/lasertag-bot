import { Context, NarrowedContext } from 'telegraf'
import { Message, Update } from 'telegraf/typings/core/types/typegram'

import { BaseGame } from '$/game/types'
import { BaseLogger } from '$/logger/types'

export interface GameContext extends Context {
  game: BaseGame
  logger: BaseLogger
  isAdmin: boolean
  isCreator: boolean
}

export type CommandHandler = (ctx: NarrowedContext<GameContext, Update.MessageUpdate<Message.TextMessage>>) => Promise<any>

export interface Command {
  name: string
  handler: CommandHandler
  description: string
  showInMenu: boolean
}
