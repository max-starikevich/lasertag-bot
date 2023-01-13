import { Context, NarrowedContext } from 'telegraf'
import { ChatMember, Message, Update } from 'telegraf/typings/core/types/typegram'

import { BaseGame } from '$/game/types'
import { BaseLogger } from '$/logger/types'
import { TranslationFunctions } from '../lang/i18n-types'

export interface GameContext extends Context {
  game: BaseGame
  logger: BaseLogger

  isAdmin: boolean
  isCreator: boolean

  isPrivateChat: boolean
  isGroupChat: boolean

  memberStatus: ChatMember['status']

  lang: TranslationFunctions
}

export type CommandHandler = (ctx: NarrowedContext<GameContext, Update.MessageUpdate<Message.TextMessage>>) => Promise<any>

export interface Command {
  name: string
  handler: CommandHandler
  description: (lang: TranslationFunctions) => string
  showInMenu: boolean
}
