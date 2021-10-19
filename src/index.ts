require('module-alias/register');

import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.APP_ENV
});

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { checkEnvironment } from '@/config';
import { initBot } from '@/bot';
import { handleWebhookError, handleStartupError } from '@/errors';
import { parseJsonSafe } from '@/utils';

const init = async () => {
  try {
    await checkEnvironment();

    const bot = await initBot();

    return { bot };
  } catch (e) {
    handleStartupError(e);
    return null;
  }
};

export const instancePromise = init();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const instance = await instancePromise;

    if (!instance) {
      return {
        statusCode: 500,
        body: `Cannot initialize bot`
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: 'Missing body'
      };
    }

    const payload = parseJsonSafe(event.body);

    if (!payload) {
      return {
        statusCode: 400,
        body: 'Incorrect payload'
      };
    }

    const { bot } = instance;

    await bot.handleUpdate(payload);

    return {
      statusCode: 200,
      body: 'OK'
    };
  } catch (e) {
    handleWebhookError(e);

    return {
      statusCode: 500,
      body: 'Unexpected server error'
    };
  }
};
