import { Telegraf } from 'telegraf';

import { BotContext } from '@/types';
import { setBotCommands } from '@/commands';
import config from '@/config';
import { getSpreadsheetDocument } from '@/sheets';

export const prepareBot = async () => {
  const bot = new Telegraf<BotContext>(config.BOT_TOKEN);
  bot.context.document = getSpreadsheetDocument();

  await setBotCommands(bot);

  return bot;
};
