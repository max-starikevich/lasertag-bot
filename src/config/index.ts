const APP_ENV = process.env.APP_ENV ?? 'local'
const isProduction = APP_ENV === 'production'
const isLocal = !isProduction

const BOT_TOKEN = process.env.BOT_TOKEN as string
const WEBHOOK_BASE = process.env.WEBHOOK_BASE as string
const WEBHOOK_PATH = `/webhook/${BOT_TOKEN}`
const WEBHOOK_FULL = `${WEBHOOK_BASE}${WEBHOOK_PATH}`

const defaultConfig = {
  isProduction,
  isLocal,
  APP_ENV,
  PORT: process.env.PORT ?? '4000', // dev only
  WEBHOOK_PATH,
  WEBHOOK_FULL
}

export const requiredConfigInput = {
  WEBHOOK_BASE,
  BOT_TOKEN,
  TELEGRAM_HOME_CHAT_ID: process.env.TELEGRAM_HOME_CHAT_ID as string,

  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL as string,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY as string,
  GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID as string,

  PLAYERS_SHEETS_ID: process.env.PLAYERS_SHEETS_ID as string,
  GAME_SHEETS_ID: process.env.GAME_SHEETS_ID as string,

  DEFAULT_RATING_LEVEL: parseInt(process.env.DEFAULT_RATING_LEVEL ?? '0')
}

const config = { ...defaultConfig, ...requiredConfigInput }

export default config
