import { Context, Telegraf } from 'telegraf';
import { GoogleSpreadsheet } from 'google-spreadsheet';

import { setBotCommands } from '@/commands';
import config from '@/config';
import { getSpreadsheetDocument } from '@/sheets';

export interface BotContext extends Context {
  document?: GoogleSpreadsheet;
}

export const initBot = async () => {
  const bot = new Telegraf<BotContext>(config.BOT_TOKEN);
  bot.context.document = getSpreadsheetDocument();

  await setBotCommands(bot);

  return bot;
};
