import { Context, Telegraf } from 'telegraf'
import { GoogleSpreadsheet } from 'google-spreadsheet'

import config from '$/config'
import { setBotCommands } from '$/commands'
import { getSpreadsheetDocument } from '$/sheets'

export interface BotContext extends Context {
  document?: GoogleSpreadsheet
}

export const initBot = async (): Promise<Telegraf<BotContext>> => {
  const bot = new Telegraf<BotContext>(config.BOT_TOKEN)
  bot.context.document = getSpreadsheetDocument()

  await setBotCommands(bot)

  return bot
}
