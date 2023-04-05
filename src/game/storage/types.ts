import { Locales } from '$/lang/i18n-types'

import { Player } from '../player/types'
import { GameLocation } from '../types'

export interface GameStorage {
  getPlayers: () => Promise<Player[]>
  getPlaceAndTime: (lang: Locales) => Promise<GameLocation>
  savePlayer: (player: Player) => Promise<Player>
}
