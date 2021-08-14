type EnvironmentValidator = () => Promise<boolean>;

type EnvironmentToCheck = {
  [key: string]: EnvironmentValidator;
};

const APP_ENV = process.env.APP_ENV || 'local';
const isProduction = APP_ENV === 'production';

const config = {
  isProduction,
  BOT_TOKEN: process.env.BOT_TOKEN as string,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY as string,
  GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID as string,
  APP_ENV: process.env.APP_ENV as string
  // HOOK_PATH: process.env.HOOK_PATH
};

const requiredVariables: EnvironmentToCheck = {
  BOT_TOKEN: async () => (process.env.BOT_TOKEN || '').length > 0,
  GOOGLE_API_KEY: async () => (process.env.GOOGLE_API_KEY || '').length > 0,
  GOOGLE_SPREADSHEET_ID: async () =>
    (process.env.GOOGLE_SPREADSHEET_ID || '').length > 0

  // HOOK_PATH: async () => {
  //   if (!config.isProduction) {
  //     return true;
  //   }

  //   return (process.env.HOOK_PATH || '').length > 0;
  // }
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

  return true;
};

export default config;
