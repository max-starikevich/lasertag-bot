import { Telegraf } from 'telegraf';

import helpHandler from './help';
import attendHandler from './attend';
import { handlerWrapper } from '../utilities';
// import { getSheetsClient } from '../services/sheetsClient';

import { BotContext } from '../types';

export const prepareBot = async () => {
  const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN as string);

  // bot.context.sheetsClient = await getSheetsClient();

  bot.start((ctx) => handlerWrapper(helpHandler, ctx));
  // bot.help((ctx) => handlerWrapper(helpHandler, ctx));
  bot.command('attend', (ctx) => handlerWrapper(attendHandler, ctx));

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  return bot;
};

export const launchBot = async (bot: Telegraf<BotContext>) => {
  if (process.env.APP_ENV === 'production' || !!process.env.HOOK_PATH) {
    await bot.launch({
      webhook: {
        hookPath: process.env.HOOK_PATH
      }
    });

    console.info(`🚀 The bot is online at https://${process.env.HOOK_PATH}.`);
  } else {
    await bot.launch();

    console.info(`🚀 The bot is online in polling mode.`);
  }

  return bot;
};
