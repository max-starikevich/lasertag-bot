import { Locales } from '$/lang/i18n-types'

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
  DEFAULT_LOCALE: process.env.DEFAULT_LOCALE as Locales,
  TELEGRAM_HOME_CHAT_ID: process.env.TELEGRAM_HOME_CHAT_ID as string,

  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL as string,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY as string,

  PLAYERS_DOC_ID: process.env.PLAYERS_DOC_ID as string,
  PLAYERS_SHEETS_ID: process.env.PLAYERS_SHEETS_ID as string,

  GAME_DOC_ID: process.env.GAME_DOC_ID as string,
  GAME_SHEETS_ID: process.env.GAME_SHEETS_ID as string,

  LINKS_DOC_ID: process.env.LINKS_DOC_ID as string,
  LINKS_SHEETS_ID: process.env.LINKS_SHEETS_ID as string,

  ENROLL_DOC_ID: process.env.ENROLL_DOC_ID as string,
  ENROLL_SHEETS_ID: process.env.ENROLL_SHEETS_ID as string,
  ENROLL_NAMES_RANGE: process.env.ENROLL_NAMES_RANGE as string,
  ENROLL_COUNT_RANGE: process.env.ENROLL_COUNT_RANGE as string,
  ENROLL_RENT_RANGE: process.env.ENROLL_RENT_RANGE as string,
  ENROLL_COMMENT_RANGE: process.env.ENROLL_COMMENT_RANGE as string,

  STATS_DOC_ID: process.env.STATS_DOC_ID as string,
  STATS_SHEETS_ID: process.env.STATS_SHEETS_ID as string,
  STATS_TIMEZONE: process.env.STATS_TIMEZONE as string,

  STORE_DOC_ID: process.env.STORE_DOC_ID as string,
  STORE_SHEETS_ID: process.env.STORE_SHEETS_ID as string

  
}

const config = { ...defaultConfig, ...requiredConfigInput }

export default config
