import { Player, GameStatsData } from '$/features/players/types'
import { GameLink, GameLocation, IGameStorage } from '$/features/players/storage/types'

export const storageFactory = async (): Promise<IGameStorage> => {
  return {
    getPlayers: async function (): Promise<Player[]> {
      return []
    },
    getLocation: async function (): Promise<GameLocation> {
      return {
        location: 'test',
        date: 'test'
      }
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
    })
  }
}
