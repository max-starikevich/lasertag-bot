// import { promisify } from 'util';
// import { readFile as readFileClassic } from 'fs';

// const readFile = promisify(readFileClassic);

type EnvironmentValidator = () => Promise<boolean>;

type EnvironmentToCheck = {
  [key: string]: EnvironmentValidator;
};

// const validateRange = (range?: string) => !!range;

const requiredVariables: EnvironmentToCheck = {
  BOT_TOKEN: async () => (process.env.BOT_TOKEN || '').length > 0
  // SPREADSHEET_ID: async () => (process.env.SPREADSHEET_ID || '').length > 0,
  // SHEET_NAME: async () => (process.env.SHEET_NAME || '').length > 0,

  // GCLOUD_PROJECT: async () => (process.env.GCLOUD_PROJECT || '').length > 0,
  // GOOGLE_APPLICATION_CREDENTIALS: async () => {
  //   if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  //     return false;
  //   }
  //   try {
  //     await readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // },

  // COUNT_RANGE: async () => validateRange(process.env.COUNT_RANGE),
  // WEAPONS_RANGE: async () => validateRange(process.env.WEAPONS_RANGE),
  // USERNAME_RANGE: async () => validateRange(process.env.USERNAME_RANGE)
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
