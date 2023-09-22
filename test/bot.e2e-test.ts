import { initBot } from '$/bot/bot'

import { TelegrafTest } from './TelegrafTest'

import { getTestStorage } from './storage'
import { getTestStore } from './store'

describe('Telegraf bot', () => {
  const token = 'test'

  const botPort = 3000
  const botPath = 'secret-path'
  const botWebhookUrl = `http://127.0.0.1:${botPort}/${botPath}`

  const telegramApiPort = 3001

  const telegramApi = new TelegrafTest({
    botWebhookUrl,
    port: telegramApiPort,
    token
  })

  telegramApi.setUser({
    id: 1234,
    username: 'TestUser'
  })

  const storage = getTestStorage()
  const store = getTestStore()

  const botPromise = initBot({
    token,
    storage,
    store,
    telegramApiOptions: {
      apiRoot: `http://127.0.0.1:${telegramApiPort}`
    },
    locale: 'en'
  })

  beforeAll(async () => {
    await telegramApi.startServer()

    await (await botPromise).launch({
      webhook: {
        hookPath: `/${botPath}`,
        port: botPort,
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