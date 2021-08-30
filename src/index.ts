require('module-alias/register');

import * as Sentry from '@sentry/node';

import { version } from '../package.json';
import config, { checkEnvironment } from '@/config';
import { handleStartupError, handleUnexpectedRejection } from '@/errors';
import { prepareBot } from '@/bot';
import { logger } from '@/logger';
import { launchApi } from '@/api';

Sentry.init({
  dsn: config.SENTRY_DSN,
  environment: config.APP_ENV,
  release: version
});

checkEnvironment()
  .then(async () => {
    const bot = await prepareBot();
    const webhookPath = `/webhook/${bot.secretPathComponent()}`;
    const api = await launchApi({ bot, webhookPath });
    const webhook = `https://${config.HOOK_DOMAIN}${webhookPath}`;

    const { url: currentWebhook } = await bot.telegram.getWebhookInfo();

    if (webhook !== currentWebhook) {
      await bot.telegram.setWebhook(webhook);
    }

    process.on('unhandledRejection', handleUnexpectedRejection);

    process.on('SIGTERM', () => {
      logger.info('⏳ Shutting down the server gracefully');

      api.close();
      process.exit();
    });

    if (process.send) {
      process.send('ready');
    }

    logger.info(`🚀 The bot v${version} is online. PID: ${process.pid}`);

    return bot;
  })
  .catch(handleStartupError);
