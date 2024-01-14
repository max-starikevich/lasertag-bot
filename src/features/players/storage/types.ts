import { GameStatsData, Player } from '../types'

export interface IGameStorage {
  getPlayers: () => Promise<Player[]>
  getLocation: () => Promise<GameLocation>
  getLinks: () => Promise<GameLink[]>

  savePlayer: (name: string, fields: Partial<Player>) => Promise<void>
  saveStats: (statsData: GameStatsData) => Promise<void>
  getStatsTimezone: () => string
}

export interface GameLocation {
  location: string
  date: string
}

export type GameLink = string
