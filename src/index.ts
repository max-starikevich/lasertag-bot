import 'module-alias/register';

import * as Sentry from '@sentry/node'
import { version } from '../package.json'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.APP_ENV,
  release: version
})

export { handler } from '$/lambda'