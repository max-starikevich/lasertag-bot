import * as Sentry from '@sentry/node';

import { logger } from '@/logger';

export class UserError extends Error {}

export const handleActionError = (error: Error) => {
  logger.error('❌ Action failed.', error);
  Sentry.captureException(error);
};

export const handleWebhookError = (error: Error) => {
  logger.error('❌ Webhook handler failed.', error);
  Sentry.captureException(error);
};

export const handleStartupError = (error: Error) => {
  logger.error('❌ Startup failed.', error);
  Sentry.captureException(error);

  Sentry.close(5000).then(() => {
    process.exit();
  });
};

export const handleUnexpectedRejection = (error: Error) => {
  logger.error('❌ Unexpected rejection.', error);
  Sentry.captureException(error);

  Sentry.close(5000).then(() => {
    process.exit();
  });
};
