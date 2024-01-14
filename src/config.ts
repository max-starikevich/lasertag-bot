import { CompletionCreateParamsBase } from 'openai/resources/completions'

import { Locales } from '$/lang/i18n-types'

const APP_ENV = process.env.APP_ENV ?? 'local'
const isProduction = APP_ENV === 'production'
const isLocal = !isProduction

const BOT_TOKEN = process.env.BOT_TOKEN ?? '123123123'
const WEBHOOK_BASE = process.env.WEBHOOK_BASE ?? 'http://unknown-domain/webhook'
const WEBHOOK_PATH = `/webhook/${BOT_TOKEN}`
const WEBHOOK_FULL = `${WEBHOOK_BASE}${WEBHOOK_PATH}`

export const config = {
  isProduction,
  isLocal,
  APP_ENV,
  PORT: process.env.PORT ?? '4000', // dev only
  WEBHOOK_PATH,
  WEBHOOK_FULL,

  WEBHOOK_BASE,
  BOT_TOKEN,
  DEFAULT_LOCALE: (process.env.DEFAULT_LOCALE ?? 'ru') as Locales,
  TELEGRAM_HOME_CHAT_ID: process.env.TELEGRAM_HOME_CHAT_ID,

  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,

  PLAYERS_DOC_ID: process.env.PLAYERS_DOC_ID,
  PLAYERS_SHEETS_ID: process.env.PLAYERS_SHEETS_ID,

  GAME_DOC_ID: process.env.GAME_DOC_ID,
  GAME_SHEETS_ID: process.env.GAME_SHEETS_ID,

  LINKS_DOC_ID: process.env.LINKS_DOC_ID,
  LINKS_SHEETS_ID: process.env.LINKS_SHEETS_ID,

  ENROLL_DOC_ID: process.env.ENROLL_DOC_ID,
  ENROLL_SHEETS_ID: process.env.ENROLL_SHEETS_ID,
  ENROLL_NAMES_RANGE: process.env.ENROLL_NAMES_RANGE,
  ENROLL_COUNT_RANGE: process.env.ENROLL_COUNT_RANGE,
  ENROLL_RENT_RANGE: process.env.ENROLL_RENT_RANGE,
  ENROLL_COMMENT_RANGE: process.env.ENROLL_COMMENT_RANGE,

  STATS_DOC_ID: process.env.STATS_DOC_ID,
  STATS_SHEETS_ID: process.env.STATS_SHEETS_ID,
  STATS_TIMEZONE: process.env.STATS_TIMEZONE,

  STORE_DOC_ID: process.env.STORE_DOC_ID,
  STORE_SHEETS_ID: process.env.STORE_SHEETS_ID,

  SKILLS_DOC_ID: process.env.SKILLS_DOC_ID,
  SKILLS_SHEETS_ID: process.env.SKILLS_SHEETS_ID,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  CHATGPT_MODEL: (process.env.CHATGPT_MODEL ?? 'gpt-4') as CompletionCreateParamsBase['model'],

  SENTRY_DEPLOY_WEBHOOK: process.env.SENTRY_DEPLOY_WEBHOOK,
  SENTRY_DSN: process.env.SENTRY_DSN
}
