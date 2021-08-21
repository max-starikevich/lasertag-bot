import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1
});

require('module-alias/register');

import config, { checkEnvironment } from '@/config';
import { handleStartupError } from '@/errors';
import { launchBot } from '@/bot';
import { logger } from '@/logger';
import { launchApi } from '@/api';

checkEnvironment()
  .then(async () => {
    const bot = await launchBot();
    const secretPath = `/webhook/${bot.secretPathComponent()}`;

    await launchApi(bot, secretPath);
    await bot.telegram.setWebhook(`https://${config.HOOK_DOMAIN}${secretPath}`);

    logger.info(`🚀 The bot is online`);

    return bot;
  })
  .catch(handleStartupError);
