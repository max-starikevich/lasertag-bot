import { Telegraf } from 'telegraf';
import Koa from 'koa';
import body from 'koa-body';
import Router from 'koa-router';

import config from '@/config';
import { logger } from '@/logger';
import { BotContext } from '@/types';

export const launchApi = (bot: Telegraf<BotContext>, secretPath: string) => {
  const koa = new Koa();
  const router = new Router();

  router.post(secretPath, async (ctx) => {
    try {
      await bot.handleUpdate(ctx.request.body);
      ctx.status = 200;
    } catch (e) {
      ctx.status = 500;
      logger.error(e);
    }
  });

  router.get('/healthcheck', (ctx) => {
    ctx.status = 200;
  });

  koa.use(body());
  koa.use(router.routes());

  return new Promise((resolve) => koa.listen(config.PORT, () => resolve(true)));
};
