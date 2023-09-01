import { Player, GameStatsData } from '$/game/player/types'
import { GameStorage } from '$/game/storage/types'
import { GameLocation, GameLink } from '$/game/types'

export const getTestStorage = (): GameStorage => {
  return {
    getPlayers: async function (): Promise<Player[]> {
      return []
    },
    getLocations: async function (): Promise<GameLocation[]> {
      return []
    },
    getLinks: jest.fn(async function (): Promise<GameLink[]> {
      return []
    }),
    savePlayer: jest.fn(async function (name: string, fields: Partial<Player>): Promise<void> {
      // do nothing
    }),
    saveStats: jest.fn(async function (statsData: GameStatsData): Promise<void> {
      // do nothing
    }),
    getStatsTimezone: jest.fn(function (): string {
      return 'Europe/Minsk'
    })
  }
}
