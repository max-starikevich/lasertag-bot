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
  getPlayers: (cacheId?: number) => Promise<Player[]>
  getClanPlayers: (cacheId?: number) => Promise<ClanPlayer[]>
  getTeams: (cacheId?: number) => Promise<Teams>
  getTeamsWithClans: (cacheId?: number) => Promise<Teams>

  getPlaceAndTime: () => Promise<GameLocation[]>
  getLinks: () => Promise<GameLink[]>

  savePlayer: (name: string, fields: Partial<Player>) => Promise<void>
}
