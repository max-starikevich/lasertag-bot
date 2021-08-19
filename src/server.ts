require('module-alias/register');

import { Telegraf } from 'telegraf';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import Koa from 'koa';
import body from 'koa-body';
import Router from 'koa-router';

import { BotContext } from '@/types';
import { setBotCommands } from '@/commands';
import config, { checkEnvironment } from '@/config';
import { handleStartupError, handleUnexpectedRejection } from '@/errors';
import { logger } from '@/logger';

const launchBot = async () => {
  const bot = new Telegraf<BotContext>(config.BOT_TOKEN);
  const document = new GoogleSpreadsheet(config.GOOGLE_SPREADSHEET_ID);
  const koa = new Koa();
  const router = new Router();

  document.useApiKey(config.GOOGLE_API_KEY);
  bot.context.document = document;

  await setBotCommands(bot);

  const secretPath = `/webhook/${bot.secretPathComponent()}`;
  await bot.telegram.setWebhook(`https://${config.HOOK_DOMAIN}${secretPath}`);

  router.post(secretPath, async (ctx) => {
    await bot.handleUpdate(ctx.request.body);
    ctx.status = 200;
  });

  router.get('/healthcheck', (ctx) => {
    ctx.status = 200;
  });

  router.get('/version', (ctx) => {
    ctx.status = 200;
    ctx.body = config.VERSION;
  });

  koa.use(body());
  koa.use(router.routes());

  await new Promise((resolve) => {
    koa.listen(config.PORT, () => {
      resolve(true);
    });
  });

  // tell PM2 that this process is ready
  if (process.send) {
    process.send('ready');
  }

  logger.info(`🚀 The bot is online`);

  return bot;
};

process.on('unhandledRejection', handleUnexpectedRejection);

checkEnvironment().then(launchBot).catch(handleStartupError);
