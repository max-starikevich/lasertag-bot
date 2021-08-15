import { Telegraf } from 'telegraf';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import Koa from 'koa';
import body from 'koa-body';
import Router from 'koa-router';

import config from '@/config';
import { BotContext } from '@/types';
import { setBotActions } from '@/actions/index';

export const launchBot = async () => {
  const bot = new Telegraf<BotContext>(config.BOT_TOKEN);

  const document = new GoogleSpreadsheet(config.GOOGLE_SPREADSHEET_ID);
  document.useApiKey(config.GOOGLE_API_KEY);
  bot.context.document = document;

  await setBotActions(bot);

  const secretPath = `/webhook/${bot.secretPathComponent()}`;
  bot.telegram.setWebhook(`https://${config.HOOK_DOMAIN}${secretPath}`);

  const koa = new Koa();
  const router = new Router();

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
  koa.listen(config.PORT);

  console.info(`🚀 The bot is online`);

  process.once('SIGINT', () => {
    bot.stop('SIGINT');
  });

  process.once('SIGTERM', () => {
    bot.stop('SIGTERM');
  });

  return bot;
};
