import { NarrowedContext } from 'telegraf'
import { ChatMember, Message, Update } from 'telegraf/typings/core/types/typegram'
import { Deunionize } from 'telegraf/typings/deunionize'

import { ILogger } from '$/logger/types'
import { Locales, TranslationFunctions } from '$/lang/i18n-types'

import { Player, ITeamBalancer } from '$/features/players/types'
import { IGameStorage } from '$/features/players/storage/types'
import { IKeyValueStore } from '$/features/key-value/types'

import { CustomContext } from './CustomContext'

export interface GameContext<U extends Deunionize<Update> = Update> extends CustomContext<U> {
  logger: ILogger

  lang: TranslationFunctions
  locale: Locales

  isAdminOfHomeChat: boolean
  isCreatorOfHomeChat: boolean
  isPrivateChat: boolean
  memberStatus: ChatMember['status']

  players: Player[]
  currentPlayer: Player | undefined
  isAdminPlayer: boolean

  getStorage: () => Promise<IGameStorage>
  getKeyValueStore: () => Promise<IKeyValueStore>

  getNoClansBalancer: () => Promise<ITeamBalancer>
  getClansBalancer: () => Promise<ITeamBalancer>
  getChatGptBalancer: () => Promise<ITeamBalancer>
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
