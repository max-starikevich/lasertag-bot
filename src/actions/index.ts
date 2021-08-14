import { Telegraf } from 'telegraf';
import { GoogleSpreadsheet } from 'google-spreadsheet';

import config from '../config';
import teamsHandler from './teams';
import helpHandler from './help';
import { handlerWrapper } from '../utilities';
import { BotContext } from '../types';

export const prepareBot = async () => {
  const bot = new Telegraf<BotContext>(config.BOT_TOKEN);

  const document = new GoogleSpreadsheet(config.GOOGLE_SPREADSHEET_ID);
  document.useApiKey(config.GOOGLE_API_KEY);
  bot.context.document = document;

  bot.start((ctx) => handlerWrapper(helpHandler, ctx));
  bot.help((ctx) => handlerWrapper(helpHandler, ctx));
  bot.hears('🪄 Составы', (ctx) => handlerWrapper(teamsHandler, ctx));

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  return bot;
};

export const launchBot = async (bot: Telegraf<BotContext>) => {
  await bot.launch();
  console.info(`🚀 The bot is online in the polling mode.`);
  return bot;
};
