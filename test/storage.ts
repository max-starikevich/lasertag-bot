import { Player, GameStatsData } from '$/game/player/types'
import { IGameStorage } from '$/game/storage/types'
import { GameLocation, GameLink } from '$/game/types'

export const getTestStorage = (): IGameStorage => {
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
    savePlayer: jest.fn(async function (_name: string, _fields: Partial<Player>): Promise<void> {
      // do nothing
    }),
    saveStats: jest.fn(async function (_statsData: GameStatsData): Promise<void> {
      // do nothing
    }),
    getStatsTimezone: jest.fn(function (): string {
      return 'Europe/Minsk'
    }),
    loadDebugInfo: jest.fn(async function (): Promise<object> {
      return { debug: 'some data' }
    })
  }
}
