import { logger } from '@/logger';

export const handleActionError = (error: Error) => {
  logger.error('❌ Action failed.', error);
};

export const handleStartupError = (error: Error) => {
  logger.error('❌ Startup failed.', error);
  process.exit(1);
};

export const handleUnexpectedRejection = (error: any) => {
  logger.error('❌ Unexpected rejection.', error);
  process.exit(1);
};

export class HandledError extends Error {}
