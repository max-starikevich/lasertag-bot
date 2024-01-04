import { NarrowedContext } from 'telegraf'
import { ChatMember, Message, Update } from 'telegraf/typings/core/types/typegram'

import { Player, ITeamBalancer } from '$/game/player/types'

import { ILogger } from '$/logger/types'
import { Locales, TranslationFunctions } from '$/lang/i18n-types'
import { IGameStorage, IGameStore } from '$/game/storage/types'
import { CustomContext } from './CustomContext'

export interface AvailableTeamBalancers {
  noClans: ITeamBalancer
  withClans: ITeamBalancer
  chatGpt: ITeamBalancer
}

export interface GameContext extends CustomContext {
  storage: IGameStorage
  store: IGameStore
  logger: ILogger

  balancers: AvailableTeamBalancers

  isAdminOfHomeChat: boolean
  isCreatorOfHomeChat: boolean

  isPrivateChat: boolean

  memberStatus: ChatMember['status']

  lang: TranslationFunctions
  locale: Locales

  currentPlayer: Player | undefined
  isAdmin: boolean

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
