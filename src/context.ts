import * as Sentry from '@sentry/node'
import { User } from 'telegraf/typings/core/types/typegram'

import { BotContext } from '$/bot'

export interface LogDataFromContextParams {
  ctx: BotContext
  commandName: string
}

export interface LogDataFromContext {
  userId: string
  username: string
  firstName: string
  lastName: string
  commandName?: string
}

export const trackUser = async ({ userId, ...restLogData }: LogDataFromContext): Promise<void> => {
  Sentry.setUser({
    id: `${userId}`,
    ...restLogData
  })
}

export const getLogData = ({ ctx, commandName }: Partial<LogDataFromContextParams>): LogDataFromContext => {
  const user: Partial<User> = ctx?.message?.from ?? {}

  const {
    id = 'unknown',
    username = 'unknown',
    first_name: firstName = 'unknown',
    last_name: lastName = 'unknown'
  } = user

  return {
    userId: `${id}`, username, firstName, lastName, commandName
  }
}
