import { initBot } from '$/bot/bot'
import { GameStorage, GameStore, StoreData } from '$/game/storage/types'
import { Player, GameStatsData } from '$/game/player/types'
import { GameLocation, GameLink } from '$/game/types'

import TelegrafTest from './TelegrafTest'

describe('Telegraf bot', () => {
  const token = 'test'
  const appPort = 3000
  const appPath = 'secret-path'
  const appUrl = `http://127.0.0.1:${appPort}/${appPath}`
  const telegramPort = 3001

  const telegramApi = new TelegrafTest({
    url: appUrl,
    port: telegramPort,
    token
  })

  telegramApi.setUser({
    id: 1234,
    username: 'TestUser'
  })

  const store: GameStore = {
    get: async function <T>(keys: string[]): Promise<Array<StoreData<T>>> {
      throw new Error('Function not implemented.')
    },
    set: async function <T>(data: Array<StoreData<T>>): Promise<void> {
      throw new Error('Function not implemented.')
    },
    delete: async function (keys: string[]): Promise<void> {
      throw new Error('Function not implemented.')
    }
  }

  const storage: GameStorage = {
    getPlayers: jest.fn(async function (): Promise<Player[]> {
      return []
    }),
    getLocations: async function (): Promise<GameLocation[]> {
      throw new Error('Function not implemented.')
    },
    getLinks: async function (): Promise<GameLink[]> {
      throw new Error('Function not implemented.')
    },
    savePlayer: async function (name: string, fields: Partial<Player>): Promise<void> {
      throw new Error('Function not implemented.')
    },
    saveStats: async function (statsData: GameStatsData): Promise<void> {
      throw new Error('Function not implemented.')
    },
    getStatsTimezone: function (): string {
      throw new Error('Function not implemented.')
    }
  }

  const botPromise = initBot({
    token,
    storage,
    store,
    telegramApiOptions: {
      apiRoot: `http://127.0.0.1:${telegramPort}`
    },
    locale: 'en'
  })

  beforeAll(async () => {
    await telegramApi.startServer()

    await (await botPromise).launch({
      webhook: {
        hookPath: `/${appPath}`,
        port: appPort,
        domain: '127.0.0.1'
      }
    })
  })

  afterAll(async () => {
    (await botPromise).stop('E2E testing shutdown')

    await telegramApi.stopServer()
  })

  describe('/about', () => {
    it('should properly get the information', async () => {
      await telegramApi.sendMessageWithText('/about')

      expect(storage.getPlayers).toBeCalled()
    })
  })
})
