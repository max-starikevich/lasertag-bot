import { Locales } from '$/lang/i18n-types'
import { BaseLogger } from '../logger/types'

import { ClanPlayer, Player, Teams } from './player/types'

export interface GameLocation {
  location: string
  date: string

  lang: Locales
}

export interface GameLink {
  url: string
  description: string

  lang: Locales
}

export interface GameGetParams {
  logger: BaseLogger
}

export interface BaseGame {
  getPlayers: (params: GameGetParams) => Promise<Player[]>
  getClanPlayers: (params: GameGetParams) => Promise<ClanPlayer[]>
  getTeams: (params: GameGetParams) => Promise<Teams>
  getTeamsWithClans: (params: GameGetParams) => Promise<Teams>

  getPlaceAndTime: (params: GameGetParams) => Promise<GameLocation[]>
  getLinks: (params: GameGetParams) => Promise<GameLink[]>

  savePlayer: (name: string, fields: Partial<Player>) => Promise<void>
}
