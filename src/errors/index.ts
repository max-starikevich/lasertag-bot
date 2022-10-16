import * as Sentry from '@sentry/node'

export const captureException = (e: any): void => {
  Sentry.captureException(e)
}
