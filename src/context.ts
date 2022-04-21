import * as Sentry from '@sentry/node'
import { User } from 'telegraf/typings/core/types/typegram'

export interface UserFromContext {
  userId: string
  username: string
  firstName: string
  lastName: string
}

export const trackUser = async ({ userId, ...user }: UserFromContext): Promise<void> => {
  Sentry.setUser({
    id: userId,
    ...user
  })
}

export const getUserDataFromContext = (user: Partial<User> = {}): UserFromContext => {
  const {
    id = 'unknown',
    username = 'unknown',
    first_name: firstName = 'unknown',
    last_name: lastName = 'unknown'
  } = user

  return {
    userId: `${id}`, username, firstName, lastName
  }
}
