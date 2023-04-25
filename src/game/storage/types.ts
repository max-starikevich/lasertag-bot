import { Player, UpdatedPlayer } from '../player/types'
import { GameLink, GameLocation } from '../types'

export interface GameStorage {
  getPlayers: () => Promise<Player[]>
  getPlaceAndTime: () => Promise<GameLocation[]>
  getLinks: () => Promise<GameLink[]>
  savePlayer: (player: UpdatedPlayer) => Promise<UpdatedPlayer>
}
