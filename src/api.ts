import { Telegraf } from 'telegraf';
import { Server } from 'http';
import Koa from 'koa';
import body from 'koa-body';
import Router from 'koa-router';

import config from '@/config';
import { BotContext } from '@/bot';
import { handleWebhookError } from '@/errors';

interface ApiOptions {
  bot: Telegraf<BotContext>;
  webhookPath: string;
}

export const launchApi = async ({
  bot,
  webhookPath
}: ApiOptions): Promise<Server> => {
  const koa = new Koa();
  const router = new Router();

  router.post(webhookPath, async (ctx) => {
    try {
      await bot.handleUpdate(ctx.request.body);
      ctx.status = 200;
    } catch (e) {
      handleWebhookError(e);
      ctx.status = 500;
    }
  });

  router.get('/healthcheck', (ctx) => {
    ctx.status = 200;
  });

  koa.use(body());
  koa.use(router.routes());

  return new Promise((resolve) => {
    const server = koa.listen(config.PORT, () => {
      resolve(server);
    });
  });
};
