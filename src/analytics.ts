import * as Sentry from '@sentry/node'

interface TrackUserParams {
  id: string
  username?: string
  firstName?: string
  lastName?: string
}

export const trackUser = async (user: TrackUserParams): Promise<void> => {
  Sentry.setUser(user)
}
