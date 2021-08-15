import { Telegraf } from 'telegraf';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import Koa from 'koa';
import body from 'koa-body';
import Router from 'koa-router';

import config from '../config';
import { BotContext } from '../types';
import { setBotActions } from './index';

export const launchBot = async () => {
  const bot = new Telegraf<BotContext>(config.BOT_TOKEN);

  const document = new GoogleSpreadsheet(config.GOOGLE_SPREADSHEET_ID);
  document.useApiKey(config.GOOGLE_API_KEY);
  bot.context.document = document;

  await setBotActions(bot);

  const secretPath = `/webhook/${bot.secretPathComponent()}`;
  bot.telegram.setWebhook(`https://${config.HOOK_DOMAIN}${secretPath}`);

  const app = new Koa();
  const router = new Router();

  router.post(secretPath, async (ctx, next) => {
    await bot.handleUpdate(ctx.request.body);
    ctx.status = 200;

    next();
  });

  router.get('/healthcheck', (ctx) => {
    ctx.status = 200;
  });

  app.use(body());
  app.use(router.routes());
  app.listen(config.PORT);

  console.info(`🚀 The bot is online`);

  return bot;
};
