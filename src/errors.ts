import * as Sentry from '@sentry/node';

import { logger } from '@/logger';
import { wait } from '@/utils';

export const handleActionError = (error: Error) => {
  logger.error('❌ Action failed.', error);
  Sentry.captureException(error);
};

export const handleStartupError = (error: Error) => {
  logger.error('❌ Startup failed.', error);
  Sentry.captureException(error);

  wait(5000).then(() => process.exit(1));
};

export const handleUnexpectedRejection = (error: any) => {
  logger.error('❌ Unexpected rejection.', error);
  Sentry.captureException(error);

  wait(5000).then(() => process.exit(1));
};

export class HandledError extends Error {}
