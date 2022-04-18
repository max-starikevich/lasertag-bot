import { Context, Telegraf } from 'telegraf'
import { GoogleSpreadsheet } from 'google-spreadsheet'

import config, { checkEnvironment } from '$/config'
import { setBotCommands } from '$/commands'
import { getSpreadsheetDocument, loadAppCells } from '$/sheets'
import { logger } from '$/logger'

export interface BotContext extends Context {
  document?: GoogleSpreadsheet
}

export const initBot = async (): Promise<Telegraf<BotContext>> => {
  await checkEnvironment()
  logger.info(`✅ Environment is OK. APP_ENV: ${config.APP_ENV}`)

  const bot = new Telegraf<BotContext>(config.BOT_TOKEN)
  const document = getSpreadsheetDocument()

  {
    const startMs = Date.now()
    await document.loadInfo()
    const finishMs = Date.now() - startMs

    logger.info(`✅ Document has loaded in ${finishMs}ms`)
  }

  {
    const startMs = Date.now()
    await loadAppCells(document)
    const finishMs = Date.now() - startMs

    logger.info(`✅ Cells have loaded in ${finishMs}ms`)
  }

  bot.context.document = document

  await setBotCommands(bot)

  return bot
}

export const updateWebhook = async (bot: Telegraf<BotContext>): Promise<void> => {
  const { url: savedWebhook } = await bot.telegram.getWebhookInfo()

  if (config.WEBHOOK_FULL !== savedWebhook) {
    await bot.telegram.setWebhook(config.WEBHOOK_FULL)
  }
}
