import { Locales } from '$/lang/i18n-types'

import { Player } from '../player/types'
import { GameLocation } from '../types'

export interface IGameStorage {
  getPlayers: () => Promise<Player[]>
  getPlaceAndTime: (lang: Locales) => Promise<GameLocation>
}
