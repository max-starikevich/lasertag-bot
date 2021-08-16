import { logger } from '@/logger';

export const handleActionError = (error: Error) => {
  logger.error('❌ Action failed.', error.message);
};

export const handleStartupError = (error: Error) => {
  logger.error('❌ Startup failed.', error.message);
  process.exit(1);
};

export const handleUnexpectedRejection = (error: any) => {
  logger.error('❌ Unexpected rejection.', error.message);
};

export class HandledError extends Error {}
