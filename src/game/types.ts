import { Locales } from '$/lang/i18n-types'

import { ClanPlayer, Player, Teams } from './player/types'

export interface IGame {
  getPlayers: () => Promise<Player[]>
  getPlaceAndTime: (lang: Locales) => Promise<GameLocation>

  getClanPlayers: () => Promise<ClanPlayer[]>
  getTeams: () => Promise<Teams>
  getTeamsWithClans: () => Promise<Teams>

  registerPlayer: (tableRow: number, telegramUserId: number) => Promise<Player>
}

export interface GameLocation {
  location: string
  date: string
}
