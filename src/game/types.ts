import { Locales } from '$/lang/i18n-types'

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

export interface BaseGame {
  getPlayers: (updateId?: number) => Promise<Player[]>
  getClanPlayers: (updateId?: number) => Promise<ClanPlayer[]>
  getTeams: (updateId?: number) => Promise<Teams>
  getTeamsWithClans: (updateId?: number) => Promise<Teams>

  getPlaceAndTime: () => Promise<GameLocation[]>
  getLinks: () => Promise<GameLink[]>

  savePlayer: (name: string, fields: Partial<Player>) => Promise<void>
}
