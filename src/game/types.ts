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
  getPlayers: () => Promise<Player[]>
  getClanPlayers: () => Promise<ClanPlayer[]>
  getTeams: () => Promise<Teams>
  getTeamsWithClans: () => Promise<Teams>

  getLocations: () => Promise<GameLocation[]>
  getLinks: () => Promise<GameLink[]>

  savePlayer: (name: string, fields: Partial<Player>) => Promise<void>
  saveStats: (teams: Teams) => Promise<void>
}
