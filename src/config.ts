const APP_ENV = process.env.APP_ENV || 'local';
const isProduction = APP_ENV === 'production';

const config = {
  isProduction,
  APP_ENV,

  PORT: process.env.PORT || '4000',
  BOT_TOKEN: process.env.BOT_TOKEN as string,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY as string,
  GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID as string,
  HOOK_DOMAIN: process.env.HOOK_DOMAIN as string,
  SENTRY_DSN: process.env.SENTRY_DSN,

  DEFAULT_PLAYER_LEVEL: 1,
  START_FROM_ROW: parseInt(process.env.START_FROM_ROW || '') || 1,
  MAX_ROW_NUMBER: parseInt(process.env.MAX_ROW_NUMBER || '') || 100,

  NAME_COLUMN: process.env.NAME_COLUMN as string,
  USERNAME_COLUMN: process.env.USERNAME_COLUMN as string,
  COUNT_COLUMN: process.env.COUNT_COLUMN as string,
  RENT_COLUMN: process.env.RENT_COLUMN as string,
  COMMENT_COLUMN: process.env.COMMENT_COLUMN as string,
  LEVEL_COLUMN: process.env.LEVEL_COLUMN as string,
  PLACE_AND_TIME_CELL: process.env.PLACE_AND_TIME_CELL as string
};

type EnvironmentValidator = () => Promise<boolean>;

type EnvironmentToCheck = {
  [key: string]: EnvironmentValidator;
};

const isCapitalLetter = (content: string) =>
  content.length === 1 && content === content.toUpperCase();

const requiredVariables: EnvironmentToCheck = {
  BOT_TOKEN: async () => (process.env.BOT_TOKEN || '').length > 0,

  GOOGLE_API_KEY: async () => (process.env.GOOGLE_API_KEY || '').length > 0,

  GOOGLE_SPREADSHEET_ID: async () =>
    (process.env.GOOGLE_SPREADSHEET_ID || '').length > 0,

  HOOK_DOMAIN: async () => (process.env.HOOK_DOMAIN || '').length > 0,

  NAME_COLUMN: async () => isCapitalLetter(process.env.NAME_COLUMN || ''),

  USERNAME_COLUMN: async () =>
    isCapitalLetter(process.env.USERNAME_COLUMN || ''),

  COUNT_COLUMN: async () => isCapitalLetter(process.env.COUNT_COLUMN || ''),

  RENT_COLUMN: async () => isCapitalLetter(process.env.RENT_COLUMN || ''),

  COMMENT_COLUMN: async () => isCapitalLetter(process.env.COMMENT_COLUMN || ''),

  LEVEL_COLUMN: async () => isCapitalLetter(process.env.LEVEL_COLUMN || ''),

  PLACE_AND_TIME_CELL: async () =>
    (process.env.PLACE_AND_TIME_CELL || '').length > 0
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

export default config;
