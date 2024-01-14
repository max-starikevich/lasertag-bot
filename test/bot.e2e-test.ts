import { initBot } from '$/bot/bot'
import { baseLocale } from '$/lang/i18n-util'

import { TelegrafTest } from './TelegrafTest/TelegrafTest'

import { getChatGptBalancer, getClansBalancer, getNoClansBalancer } from './balancers'
import { getStorage } from './storage'
import { getKeyValueStore } from './store'

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

  const bot = initBot({
    token,
    getStorage,
    getKeyValueStore,
    getNoClansBalancer,
    getClansBalancer,
    getChatGptBalancer,
    telegramApiOptions: {
      apiRoot: `http://127.0.0.1:${telegramApiPort}`
    },
    locale: baseLocale
  })

  beforeAll(async () => {
    await telegramApi.startServer()

    await bot.launch({
      webhook: {
        hookPath: `/${botPath}`,
        port: botPort,
        domain: '127.0.0.1'
      }
    })
  })

  afterAll(async () => {
    bot.stop('E2E testing shutdown')

    await telegramApi.stopServer()
  })

  describe('/about', () => {
    it('should properly get the information', async () => {
      await telegramApi.sendMessage({ text: '/about' })
    })
  })
})
