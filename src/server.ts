require('module-alias/register');

import { Telegraf } from 'telegraf';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import Koa from 'koa';
import body from 'koa-body';
import Router from 'koa-router';

import { BotContext } from '@/types';
import { setBotActions } from '@/actions/index';
import config, { checkEnvironment } from '@/config';
import { handleStartupError, handleUnexpectedRejection } from '@/errors';
import { logger } from '@/logger';

process.on('unhandledRejection', handleUnexpectedRejection);

const launchBot = async () => {
  const bot = new Telegraf<BotContext>(config.BOT_TOKEN, {});
  const document = new GoogleSpreadsheet(config.GOOGLE_SPREADSHEET_ID);
  const koa = new Koa();
  const router = new Router();

  document.useApiKey(config.GOOGLE_API_KEY);
  bot.context.document = document;

  await setBotActions(bot);

  const secretPath = `/webhook/${bot.secretPathComponent()}`;
  await bot.telegram.setWebhook(`https://${config.HOOK_DOMAIN}${secretPath}`);

  router.post(secretPath, async (ctx, next) => {
    await bot.handleUpdate(ctx.request.body);
    ctx.status = 200;

    next();
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

  process.once('SIGINT', () => {
    bot.stop('SIGINT');
  });

  process.once('SIGTERM', () => {
    bot.stop('SIGTERM');
  });

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

checkEnvironment().then(launchBot).catch(handleStartupError);
