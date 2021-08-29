const APP_ENV = process.env.APP_ENV || 'local';
const isProduction = APP_ENV === 'production';

export default {
  isProduction,
  APP_ENV,

  PORT: process.env.PORT || '4000',
  BOT_TOKEN: process.env.BOT_TOKEN as string,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY as string,
  GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID as string,
  HOOK_DOMAIN: process.env.HOOK_DOMAIN as string,
  SENTRY_DSN: process.env.SENTRY_DSN,

  DEFAULT_PLAYER_LEVEL: 1,
  IS_LATE_SYMBOL: '*'
};

type EnvironmentValidator = () => Promise<boolean>;

type EnvironmentToCheck = {
  [key: string]: EnvironmentValidator;
};

const requiredVariables: EnvironmentToCheck = {
  BOT_TOKEN: async () => (process.env.BOT_TOKEN || '').length > 0,

  GOOGLE_API_KEY: async () => (process.env.GOOGLE_API_KEY || '').length > 0,

  GOOGLE_SPREADSHEET_ID: async () =>
    (process.env.GOOGLE_SPREADSHEET_ID || '').length > 0,

  HOOK_DOMAIN: async () => (process.env.HOOK_DOMAIN || '').length > 0
};

export const checkEnvironment = async () => {
  const checksPromises = Object.entries(requiredVariables).map(
    async ([variable, validator]) => {
      try {
        const value = await validator();
        return { success: value, variable };
      } catch (e) {
        return { success: false, variable };
      }
    }
  );

  const failedVariables = (await Promise.all(checksPromises))
    .filter(({ success }) => success === false)
    .map(({ variable }) => variable);

  if (failedVariables.length > 0) {
    throw new Error(
      'Bad environment. Check these variables: ' + failedVariables.join(', ')
    );
  }
};
