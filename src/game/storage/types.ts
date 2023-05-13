import { Player, ScoredTeams } from '../player/types'
import { GameLink, GameLocation } from '../types'

export interface GameStorage {
  getPlayers: () => Promise<Player[]>
  getPlaceAndTime: () => Promise<GameLocation[]>
  getLinks: () => Promise<GameLink[]>

  savePlayer: (name: string, fields: Partial<Player>) => Promise<void>
  saveStats: (teams: ScoredTeams) => Promise<void>
}
