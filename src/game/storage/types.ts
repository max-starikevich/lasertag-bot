import { Player } from '../player/types'
import { GameLink, GameLocation } from '../types'

export interface GameStorage {
  getPlayers: () => Promise<Player[]>
  getPlaceAndTime: () => Promise<GameLocation[]>
  getLinks: () => Promise<GameLink[]>
  savePlayer: (player: Player) => Promise<Player>
}
