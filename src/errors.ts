export const handleActionError = (error: Error) => {
  console.error('❌ Action failed.', error);
};

export const handleStartupError = (error: Error) => {
  console.error('❌ Startup failed.', error);
  process.exit(1);
};

export const handleUnexpectedRejection = (error: any) => {
  console.error('❌ Unexpected rejection.', error);
};

export class HandledError extends Error {}
