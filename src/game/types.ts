import { Locales } from '$/lang/i18n-types'

import { ClanPlayer, Player, Teams } from './player/types'

export interface BaseGame {
  getPlayers: () => Promise<Player[]>
  getClanPlayers: () => Promise<ClanPlayer[]>
  getPlaceAndTime: (lang: Locales) => Promise<GameLocation>

  getTeams: () => Promise<Teams>
  getTeamsWithClans: () => Promise<Teams>

  savePlayer: (player: Player) => Promise<Player>
}

export interface GameLocation {
  location: string
  date: string
}
