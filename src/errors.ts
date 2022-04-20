import * as Sentry from '@sentry/node'

import { logger } from '$/logger'

export class UserError extends Error {}

export const handleCommandError = (error: Error): void => {
  Sentry.captureException(error)
  logger.error('❌ Command failed: ' + error.message)
}

export const handleWebhookError = (error: Error): void => {
  Sentry.captureException(error)
  logger.error('❌ Webhook handler failed: ' + error.message)
}

export const handleStartupError = (error: Error): void => {
  Sentry.captureException(error)
  logger.error('❌ Startup failed: ' + error.message)
}

export const handleUnexpectedRejection = (error: Error): void => {
  Sentry.captureException(error)
  logger.error('❌ Unexpected rejection: ' + error.message)
}

export const handleUnexpectedException = (error: Error): void => {
  Sentry.captureException(error)
  logger.error('❌ Unexpected exception: ' + error.message)
}
