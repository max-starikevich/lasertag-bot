import * as Sentry from '@sentry/node'

import { logger } from '$/logger'

export enum ServiceErrorCodes {
  NO_DOCUMENT_LOADED = 'NO_DOCUMENT_LOADED',
  NO_MESSAGE_IN_CTX = 'NO_MESSAGE_IN_CTX'
}
export class ServiceError extends Error {
  constructor (public message: string, public code: ServiceErrorCodes) {
    super(message)
  }
}

export enum UserErrorCodes {
  EMPTY_LIST = 'EMPTY_LIST',
  NOT_ENOUGH_PLAYERS = 'NOT_ENOUGH_PLAYERS'
}

export class UserError extends Error {
  constructor (public message: string, public code: UserErrorCodes) {
    super(message)
  }
}

export const handleCommandError = (error: Error): void => {
  Sentry.captureException(error)
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
