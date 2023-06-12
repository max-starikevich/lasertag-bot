import * as Sentry from '@sentry/node'

export const reportException = (e: any, ctx?: any): void => {
  Sentry.captureException(e, {
    extra: { ctx }
  })
}
