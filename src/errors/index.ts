import * as Sentry from '@sentry/node'

export const reportException = (e: any, data?: any): void => {
  Sentry.captureException(e, {
    extra: { data }
  })
}
