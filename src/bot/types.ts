import { Context, NarrowedContext } from 'telegraf'
import { ChatMember, Message, Update } from 'telegraf/typings/core/types/typegram'

import { IGame } from '$/game/types'
import { BaseLogger } from '$/logger/types'
import { Locales, TranslationFunctions } from '$/lang/i18n-types'

export interface GameContext extends Context {
  game: IGame
  logger: BaseLogger

  isAdmin: boolean
  isCreator: boolean

  isPrivateChat: boolean
  isGroupChat: boolean

  memberStatus: ChatMember['status']

  lang: TranslationFunctions
  locale: Locales
}

export type CommandHandler = (ctx: NarrowedContext<GameContext, Update.MessageUpdate<Message.TextMessage>>) => Promise<any>

export interface Command {
  name: string
  handler: CommandHandler
  description: (lang: TranslationFunctions) => string
  showInMenu: boolean
}

export type ActionHandler = (ctx: NarrowedContext<GameContext & {
  match: RegExpExecArray
}, Update.CallbackQueryUpdate>) => Promise<any>

export type ActionInitializer = (ctx: NarrowedContext<GameContext, Update.MessageUpdate<Message.TextMessage>>) => Promise<any>

export interface Action {
  name: RegExp
  initializer: ActionInitializer
  handler: ActionHandler
}
