import * as Sentry from '@sentry/node';

import { logger } from '@/logger';

export const handleActionError = (error: Error) => {
  logger.error('❌ Action failed.', error);
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

export class HandledError extends Error {}
