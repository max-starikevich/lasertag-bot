import { GameStatsData, Player } from '../player/types'
import { GameLink, GameLocation } from '../types'

export interface Debuggable {
  loadDebugInfo: () => Promise<object>
}

export interface GameStorage extends Debuggable {
  getPlayers: () => Promise<Player[]>
  getLocations: () => Promise<GameLocation[]>
  getLinks: () => Promise<GameLink[]>

  savePlayer: (name: string, fields: Partial<Player>) => Promise<void>
  saveStats: (statsData: GameStatsData) => Promise<void>
  getStatsTimezone: () => string
}

export interface StoreData<T> {
  key: string
  value: T | null
}

export interface GameStore extends Debuggable {
  get: <T>(keys: string[]) => Promise<Array<StoreData<T>>>
  set: <T>(data: Array<StoreData<T>>) => Promise<void>
  delete: (keys: string[]) => Promise<void>
}
