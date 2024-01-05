import { GameStatsData, Player } from '../player/types'
import { GameLink, GameLocation } from '../types'

export interface IDebuggable {
  loadDebugInfo: () => Promise<object>
}

export interface IGameStorage extends IDebuggable {
  getPlayers: () => Promise<Player[]>
  getLocation: () => Promise<GameLocation>
  getLinks: () => Promise<GameLink[]>

  savePlayer: (name: string, fields: Partial<Player>) => Promise<void>
  saveStats: (statsData: GameStatsData) => Promise<void>
  getStatsTimezone: () => string
}

export interface StoreData<T> {
  key: string
  value: T | null
}

export interface IGameStore extends IDebuggable {
  get: <T>(keys: string[]) => Promise<Array<StoreData<T>>>
  set: <T>(data: Array<StoreData<T>>) => Promise<void>
  delete: (keys: string[]) => Promise<void>
}
