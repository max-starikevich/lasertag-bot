require('module-alias/register');

import { APIGatewayProxyEvent } from 'aws-lambda';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';

import { handler as lambdaHandler, instancePromise } from '@/index';
import config from '@/config';
import { logger } from '@/logger';

const dev = async () => {
  const instance = await instancePromise;

  if (!instance) {
    throw new Error('The instance is unavailable');
  }

  const { bot } = instance;

  const { url: savedWebhook } = await bot.telegram.getWebhookInfo();

  const webhookPath = `/webhook/${config.BOT_TOKEN}`;
  const webhook = `https://${config.HOOK_DOMAIN}${webhookPath}`;

  if (webhook !== savedWebhook) {
    await bot.telegram.setWebhook(webhook);
    console.info('The webhook has been updated');
  }

  const app = new Koa();
  const router = new Router();

  app.use(bodyParser());

  router.post(webhookPath, async (ctx) => {
    try {
      const { statusCode, body } = await lambdaHandler({
        body: ctx.request.rawBody
      } as APIGatewayProxyEvent);

      (ctx.status = statusCode), (ctx.body = body);
    } catch (e) {
      logger.error(e);
    }
  });

  app.use(router.routes());

  app.listen(config.PORT, () => {
    console.info(
      `🚀 Development server is ready at https://${config.HOOK_DOMAIN}`
    );
  });
};

dev();
