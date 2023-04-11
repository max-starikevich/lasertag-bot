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

  getPlaceAndTime: () => Promise<GameLocation[]>
  getLinks: () => Promise<GameLink[]>

  getTeams: () => Promise<Teams>
  getTeamsWithClans: () => Promise<Teams>

  savePlayer: (player: Player) => Promise<Player>
}
