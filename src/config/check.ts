import { requiredConfigInput as config } from './index'

const isValidString = (s?: string): boolean => String(s).length > 0
const isValidEmail = (s?: string): boolean => /\S+@\S+\.\S+/.test(String(s))
const isValidNumber = (s?: string): boolean => s === undefined ? false : !isNaN(parseInt(s))

type EnvironmentValidator = () => Promise<boolean>

type EnvironmentToCheck = {
  [key in keyof typeof config]: EnvironmentValidator
}

const requiredRuntimeVariables: EnvironmentToCheck = {
  BOT_TOKEN: async () => isValidString(config.BOT_TOKEN),

  GOOGLE_SERVICE_ACCOUNT_EMAIL: async () => isValidEmail(config.GOOGLE_SERVICE_ACCOUNT_EMAIL),
  GOOGLE_PRIVATE_KEY: async () => isValidString(config.GOOGLE_PRIVATE_KEY),
  GOOGLE_SPREADSHEET_ID: async () => isValidString(config.GOOGLE_SPREADSHEET_ID),

  PLAYERS_SHEETS_ID: async () => isValidNumber(config.PLAYERS_SHEETS_ID),
  GAME_SHEETS_ID: async () => isValidNumber(config.GAME_SHEETS_ID),
  LINKS_SHEETS_ID: async () => isValidNumber(config.LINKS_SHEETS_ID),
  ENROLLMENT_SHEETS_ID: async () => isValidNumber(config.ENROLLMENT_SHEETS_ID),

  TELEGRAM_HOME_CHAT_ID: async () => isValidNumber(config.TELEGRAM_HOME_CHAT_ID),

  WEBHOOK_BASE: async () => isValidString(config.WEBHOOK_BASE)
}

export const checkEnvironment = async (): Promise<void> => {
  const checksPromises = Object.entries(requiredRuntimeVariables).map(
    async ([variable, validator]) => {
      try {
        const value = await validator()
        return { success: value, variable }
      } catch (e) {
        return { success: false, variable }
      }
    }
  )

  const failedVariables = (await Promise.all(checksPromises))
    .filter(({ success }) => !success)
    .map(({ variable }) => variable)

  if (failedVariables.length > 0) {
    throw new Error(
      'Bad environment. Check these variables: ' + failedVariables.join(', ')
    )
  }
}
