import * as Sentry from '@sentry/node'
import { version } from '../package.json'
import { reportException } from './errors'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.APP_ENV,
  release: version
})

process.on('uncaughtException', e => reportException(e))
process.on('unhandledRejection', e => reportException(e))

export { handler } from '$/lambda'
