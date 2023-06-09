import { requiredConfigInput as config } from './index'

const isValidString = (s?: string): boolean => {
  if (s === undefined) {
    return false
  }

  return s.length > 0
}

const isValidEmail = (s?: string): boolean => /\S+@\S+\.\S+/.test(String(s))
const isValidNumber = (s?: string): boolean => s === undefined ? false : !isNaN(parseInt(s))
const isValidTableRange = (s?: string): boolean => /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/.test(String(s))

const isValidTimeZone = (tz?: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz })
    return true
  } catch (error) {
    return false
  }
}

type EnvironmentValidator = () => Promise<boolean>

type EnvironmentToCheck = {
  [key in keyof typeof config]: EnvironmentValidator
}

const requiredRuntimeVariables: EnvironmentToCheck = {
  TELEGRAM_HOME_CHAT_ID: async () => isValidNumber(config.TELEGRAM_HOME_CHAT_ID),
  WEBHOOK_BASE: async () => isValidString(config.WEBHOOK_BASE),
  BOT_TOKEN: async () => isValidString(config.BOT_TOKEN),

  GOOGLE_SERVICE_ACCOUNT_EMAIL: async () => isValidEmail(config.GOOGLE_SERVICE_ACCOUNT_EMAIL),
  GOOGLE_PRIVATE_KEY: async () => isValidString(config.GOOGLE_PRIVATE_KEY),

  PLAYERS_DOC_ID: async () => isValidString(config.PLAYERS_DOC_ID),
  PLAYERS_SHEETS_ID: async () => isValidNumber(config.PLAYERS_SHEETS_ID),

  GAME_DOC_ID: async () => isValidString(config.GAME_DOC_ID),
  GAME_SHEETS_ID: async () => isValidNumber(config.GAME_SHEETS_ID),

  LINKS_DOC_ID: async () => isValidString(config.LINKS_DOC_ID),
  LINKS_SHEETS_ID: async () => isValidNumber(config.LINKS_SHEETS_ID),

  ENROLL_DOC_ID: async () => isValidString(config.ENROLL_DOC_ID),
  ENROLL_SHEETS_ID: async () => isValidNumber(config.ENROLL_SHEETS_ID),
  ENROLL_NAMES_RANGE: async () => isValidTableRange(config.ENROLL_NAMES_RANGE),
  ENROLL_COUNT_RANGE: async () => isValidTableRange(config.ENROLL_COUNT_RANGE),
  ENROLL_RENT_RANGE: async () => isValidTableRange(config.ENROLL_RENT_RANGE),
  ENROLL_COMMENT_RANGE: async () => isValidTableRange(config.ENROLL_COMMENT_RANGE),

  STATS_DOC_ID: async () => isValidString(config.STATS_DOC_ID),
  STATS_SHEETS_ID: async () => isValidNumber(config.STATS_SHEETS_ID),
  STATS_TIMEZONE: async () => isValidTimeZone(config.STATS_TIMEZONE),

  STORE_DOC_ID: async () => isValidString(config.STORE_DOC_ID),
  STORE_SHEETS_ID: async () => isValidString(config.STORE_SHEETS_ID)
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
