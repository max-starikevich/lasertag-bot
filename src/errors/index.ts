import * as Sentry from '@sentry/node'

import config from '$/config'
import { globalLogger as logger } from '../logger'

export const reportException = (e: any, data?: any): void => {
  if (config.isLocal) {
    logger.error(e, data)
    return
  }

  Sentry.captureException(e, {
    extra: { data }
  })
}
