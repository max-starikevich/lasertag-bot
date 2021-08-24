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
    const secretPath = `/webhook/${bot.secretPathComponent()}`;
    const api = await launchApi({ bot, secretPath });

    logger.info(`🚀 The bot is online. PID: ${process.pid}`);

    process.on('unhandledRejection', handleUnexpectedRejection);

    process.on('SIGTERM', async () => {
      logger.info('⏳ Shutting down the server gracefully');

      api.close();
      process.exit();
    });

    await bot.telegram.setWebhook(`https://${config.HOOK_DOMAIN}${secretPath}`);

    return bot;
  })
  .catch(handleStartupError);
