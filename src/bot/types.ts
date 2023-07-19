import { NarrowedContext } from 'telegraf'
import { ChatMember, Message, Update } from 'telegraf/typings/core/types/typegram'

import { Player } from '$/game/player/types'

import { BaseLogger } from '$/logger/types'
import { Locales, TranslationFunctions } from '$/lang/i18n-types'
import { GameStorage, GameStore } from '$/game/storage/types'
import { CustomContext } from './CustomContext'

export interface GameContext extends CustomContext {
  storage: GameStorage
  store: GameStore
  logger: BaseLogger

  isAdminInHomeChat: boolean
  isCreatorOfHomeChat: boolean

  isPrivateChat: boolean

  memberStatus: ChatMember['status']

  lang: TranslationFunctions
  locale: Locales

  currentPlayer: Player | undefined
  players: Player[]
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

export type ActionInitializer = (ctx: CommandContext) => Promise<any>

export interface Action {
  mapping: { [key: string]: ActionHandler }
}
