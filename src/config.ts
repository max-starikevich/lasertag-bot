import dotenv from 'dotenv'

const APP_ENV = process.env.APP_ENV ?? 'local'
const pathToEnvFile = APP_ENV === 'local' ? '.env' : `.env.${APP_ENV}`

dotenv.config({ path: pathToEnvFile })

const isProduction = APP_ENV === 'production'
const isLocal = !isProduction

const BOT_TOKEN = process.env.BOT_TOKEN as string
const WEBHOOK_BASE = process.env.WEBHOOK_BASE as string
const WEBHOOK_PATH = `/webhook/${BOT_TOKEN}`
const WEBHOOK_FULL = `https://${WEBHOOK_BASE}${WEBHOOK_PATH}`

const config = {
  isProduction,
  isLocal,
  APP_ENV,

  PORT: process.env.PORT ?? '4000', // dev only

  WEBHOOK_BASE,
  WEBHOOK_PATH,
  WEBHOOK_FULL,
  BOT_TOKEN,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY as string,
  GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID as string,

  DEFAULT_PLAYER_LEVEL: 0,
  START_FROM_ROW: parseInt(process.env.START_FROM_ROW ?? '') ?? 1,
  MAX_ROW_NUMBER: parseInt(process.env.MAX_ROW_NUMBER ?? '') ?? 100,

  NAME_COLUMN: process.env.NAME_COLUMN as string,
  USERNAME_COLUMN: process.env.USERNAME_COLUMN as string,
  COUNT_COLUMN: process.env.COUNT_COLUMN as string,
  RENT_COLUMN: process.env.RENT_COLUMN as string,
  COMMENT_COLUMN: process.env.COMMENT_COLUMN as string,
  LEVEL_COLUMN: process.env.LEVEL_COLUMN as string,
  PLACE_AND_TIME_CELLS: (process.env.PLACE_AND_TIME_CELLS ?? '').split(
    ','
  )
}

type EnvironmentValidator = () => Promise<boolean>

interface EnvironmentToCheck {
  [key: string]: EnvironmentValidator
}

const isCapitalLetter = (content: string): boolean =>
  content.length === 1 && content === content.toUpperCase()

const requiredVariables: EnvironmentToCheck = {
  BOT_TOKEN: async () => (process.env.BOT_TOKEN ?? '').length > 0,

  GOOGLE_API_KEY: async () => (process.env.GOOGLE_API_KEY ?? '').length > 0,

  GOOGLE_SPREADSHEET_ID: async () =>
    (process.env.GOOGLE_SPREADSHEET_ID ?? '').length > 0,

  WEBHOOK_BASE: async () => (process.env.WEBHOOK_BASE ?? '').length > 0,

  NAME_COLUMN: async () => isCapitalLetter(process.env.NAME_COLUMN ?? ''),

  USERNAME_COLUMN: async () =>
    isCapitalLetter(process.env.USERNAME_COLUMN ?? ''),

  COUNT_COLUMN: async () => isCapitalLetter(process.env.COUNT_COLUMN ?? ''),

  RENT_COLUMN: async () => isCapitalLetter(process.env.RENT_COLUMN ?? ''),

  COMMENT_COLUMN: async () => isCapitalLetter(process.env.COMMENT_COLUMN ?? ''),

  LEVEL_COLUMN: async () => isCapitalLetter(process.env.LEVEL_COLUMN ?? ''),

  PLACE_AND_TIME_CELLS: async () => {
    const cells = (process.env.PLACE_AND_TIME_CELLS ?? '').split(',')

    const failedCells = cells.filter(
      (cell) => cell.length < 2 || !isCapitalLetter(cell[0])
    )

    return failedCells.length === 0
  }
}

export const checkEnvironment = async (): Promise<void> => {
  const checksPromises = Object.entries(requiredVariables).map(
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

export default config
