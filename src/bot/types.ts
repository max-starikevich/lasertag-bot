import { Context, NarrowedContext } from 'telegraf'
import { ChatMember, Message, Update } from 'telegraf/typings/core/types/typegram'

import { Player } from '$/game/player/types'

import { BaseLogger } from '$/logger/types'
import { Locales, TranslationFunctions } from '$/lang/i18n-types'
import { GameStorage } from '$/game/storage/types'

export interface GameContext extends Context {
  storage: GameStorage
  logger: BaseLogger

  isAdmin: boolean
  isCreator: boolean

  isPrivateChat: boolean
  isGroupChat: boolean

  memberStatus: ChatMember['status']

  lang: TranslationFunctions
  locale: Locales

  currentPlayer: Player | undefined
}

export type CommandContext = NarrowedContext<GameContext, Update.MessageUpdate<Message.TextMessage>>
export type CommandHandler = (ctx: CommandContext) => Promise<any>

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
  initializer: ActionInitializer
  mapping: { [key: string]: ActionHandler }
}
