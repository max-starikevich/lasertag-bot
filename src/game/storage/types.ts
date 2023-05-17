import { Player, Teams } from '../player/types'
import { GameLink, GameLocation } from '../types'

export interface GameStorage {
  getPlayers: () => Promise<Player[]>
  getLocations: () => Promise<GameLocation[]>
  getLinks: () => Promise<GameLink[]>

  savePlayer: (name: string, fields: Partial<Player>) => Promise<void>
  saveStats: (teams: Teams) => Promise<void>
}
