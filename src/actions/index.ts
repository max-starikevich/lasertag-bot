import { Telegraf } from 'telegraf';
import { GoogleSpreadsheet } from 'google-spreadsheet';

import teamsHandler from './teams';
import helpHandler from './help';

import { handlerWrapper } from '../utilities';
import { BotContext } from '../types';

export const prepareBot = async () => {
  const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN as string);

  const document = new GoogleSpreadsheet(
    process.env.GOOGLE_SPREADSHEET_ID as string
  );

  document.useApiKey(process.env.GOOGLE_API_KEY as string);

  bot.context.document = document;

  bot.start((ctx) => handlerWrapper(helpHandler, ctx));
  bot.help((ctx) => handlerWrapper(helpHandler, ctx));
  bot.hears('🪄 Составы', (ctx) => handlerWrapper(teamsHandler, ctx));

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  return bot;
};

export const launchBot = async (bot: Telegraf<BotContext>) => {
  if (process.env) await bot.launch();

  console.info(`🚀 The bot is online in polling mode.`);

  return bot;
};
