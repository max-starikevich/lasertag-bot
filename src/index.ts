require('module-alias/register');

import * as Sentry from '@sentry/node';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import config, { checkEnvironment } from '@/config';
import { initBot } from '@/bot';
import { handleCommandError, handleStartupError } from './errors';

const init = async () => {
  try {
    Sentry.init({
      dsn: config.SENTRY_DSN,
      environment: config.APP_ENV
    });

    await checkEnvironment();

    const bot = await initBot();
    const webhookPath = `/webhook/${config.BOT_TOKEN}`;
    const webhook = `https://${config.HOOK_DOMAIN}${webhookPath}`;

    const { url: currentWebhook } = await bot.telegram.getWebhookInfo();

    if (webhook !== currentWebhook) {
      await bot.telegram.setWebhook(webhook);
    }

    return { bot };
  } catch (e) {
    handleStartupError(e);
    return null;
  }
};

const instancePromise = init();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const instance = await instancePromise;

    if (!instance) {
      return {
        statusCode: 500,
        body: `Server error`
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: 'Missing body'
      };
    }

    const { bot } = instance;

    await bot.handleUpdate(JSON.parse(event.body));

    return {
      statusCode: 200,
      body: 'OK'
    };
  } catch (e) {
    handleCommandError(e);

    return {
      statusCode: 500,
      body: 'Server error'
    };
  }
};
