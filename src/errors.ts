import * as Sentry from '@sentry/node'

import { logger } from '$/logger'

export class UserError extends Error {}

export const handleCommandError = (error: any): void => {
  Sentry.captureException(error)
  logger.error('❌ Command failed.', error)
}

export const handleWebhookError = (error: any): void => {
  Sentry.captureException(error)
  logger.error('❌ Webhook handler failed.', error)
}

export const handleStartupError = (error: any): void => {
  Sentry.captureException(error)
  logger.error('❌ Startup failed.', error)

  void Sentry.close(5000).then(() => {
    process.exit()
  })
}

export const handleUnexpectedRejection = (error: any): void => {
  Sentry.captureException(error)
  logger.error('❌ Unexpected rejection.', error)

  void Sentry.close(5000).then(() => {
    process.exit()
  })
}

export const handleUnexpectedException = (error: any): void => {
  Sentry.captureException(error)
  logger.error('❌ Unexpected exception.', error)

  void Sentry.close(5000).then(() => {
    process.exit()
  })
}
