import { requiredConfigInput as config } from './index'

const isCapitalLetter = (s?: string): boolean => {
  if (s === undefined) {
    return false
  }

  return s.length === 1 && s === s.toUpperCase()
}

const isValidNumber = (n?: number): boolean => {
  if (n === undefined) {
    return false
  }

  return !Number.isNaN(n)
}

const isValidString = (s?: string): boolean => (s ?? '').length > 0

const isValidEmail = (s?: string): boolean => /\S+@\S+\.\S+/.test(s ?? '')

type EnvironmentValidator = () => Promise<boolean>

type EnvironmentToCheck = {
  [key in keyof typeof config]: EnvironmentValidator
}

const requiredRuntimeVariables: EnvironmentToCheck = {
  BOT_TOKEN: async () => isValidString(config.BOT_TOKEN),

  GOOGLE_SERVICE_ACCOUNT_EMAIL: async () => isValidEmail(config.GOOGLE_SERVICE_ACCOUNT_EMAIL),
  GOOGLE_PRIVATE_KEY: async () => isValidString(config.GOOGLE_PRIVATE_KEY),

  TELEGRAM_HOME_CHAT_ID: async () => isValidString(config.TELEGRAM_HOME_CHAT_ID),

  WEBHOOK_BASE: async () => isValidString(config.WEBHOOK_BASE),

  GOOGLE_SPREADSHEET_ID: async () => isValidString(config.GOOGLE_SPREADSHEET_ID),
  NAME_COLUMN: async () => isCapitalLetter(config.NAME_COLUMN),
  RATING_COLUMN: async () => isCapitalLetter(config.RATING_COLUMN),
  CLAN_COLUMN: async () => isCapitalLetter(config.CLAN_COLUMN),
  COUNT_COLUMN: async () => isCapitalLetter(config.COUNT_COLUMN),
  RENT_COLUMN: async () => isCapitalLetter(config.RENT_COLUMN),
  COMMENT_COLUMN: async () => isCapitalLetter(config.COMMENT_COLUMN),
  PLACE_AND_TIME_CELLS: async () => {
    const failedCells = config.PLACE_AND_TIME_CELLS.filter(
      (cell) => cell.length < 2 || !isCapitalLetter(cell[0])
    )

    return failedCells.length === 0
  },
  START_FROM_ROW: async () => isValidNumber(config.START_FROM_ROW),
  MAX_ROW_NUMBER: async () => isValidNumber(config.MAX_ROW_NUMBER),
  DEFAULT_RATING_LEVEL: async () => isValidNumber(config.DEFAULT_RATING_LEVEL)
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
