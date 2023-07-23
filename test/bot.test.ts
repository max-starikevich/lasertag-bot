import { Telegraf } from 'telegraf'
import TelegramServer from 'telegram-test-api'
import { TelegramClient } from 'telegram-test-api/lib/modules/telegramClient'

import { initBot } from '$/bot/bot'
import { GameContext } from '$/bot/types'
import { GameStorage, GameStore, StoreData } from '$/game/storage/types'
import { Player, GameStatsData } from '../src/game/player/types'
import { GameLocation, GameLink } from '../src/game/types'

describe('Telegraf bot', () => {
  const tgServer = new TelegramServer({
    port: 8080
  })

  const token = 'test123'

  let bot: Telegraf<GameContext>
  let client: TelegramClient

  beforeAll(async () => {
    await tgServer.start()

    client = tgServer.getClient(token)

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
      getPlayers: async function (): Promise<Player[]> {
        throw new Error('Function not implemented.')
      },
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

    bot = await initBot({
      token,
      storage,
      store,
      telegram: {
        apiRoot: tgServer.config.apiURL
      }
    })

    await bot.launch()
  })

  afterAll(async () => {
    await tgServer.stop()
  })

  describe('/about', () => {
    it('should properly get the information', async () => {
      const message = client.makeMessage('/help')
      await client.sendMessage(message)
    })
  })
})
