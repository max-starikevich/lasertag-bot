import * as Sentry from '@sentry/node';

import { logger } from '@/logger';

export class UserError extends Error {}

export const handleActionError = (error: any) => {
  Sentry.captureException(error);
  logger.error('❌ Action failed.', error);
};

export const handleWebhookError = (error: any) => {
  Sentry.captureException(error);
  logger.error('❌ Webhook handler failed.', error);
};

export const handleStartupError = (error: any) => {
  Sentry.captureException(error);
  logger.error('❌ Startup failed.', error);

  Sentry.close(5000).then(() => {
    process.exit();
  });
};

export const handleUnexpectedRejection = (error: any) => {
  Sentry.captureException(error);
  logger.error('❌ Unexpected rejection.', error);

  Sentry.close(5000).then(() => {
    process.exit();
  });
};

export const handleUnexpectedException = (error: any) => {
  Sentry.captureException(error);
  logger.error('❌ Unexpected exception.', error);

  Sentry.close(5000).then(() => {
    process.exit();
  });
};
