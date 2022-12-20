import * as Sentry from '@sentry/node'

export const reportException = (e: any): void => {
  Sentry.captureException(e)
}
