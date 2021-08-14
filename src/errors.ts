export const handleActionError = (error: Error) => {
  console.error('❌ Action failed.', error.message);
};

export const handleStartupError = (error: Error) => {
  console.error('❌ Startup failed.', error.message);
  process.exit(1);
};

export const handleUnexpectedRejection = (error: any) => {
  console.error('❌ Unexpected rejection.', error.message);
};

export class HandledError extends Error {}
