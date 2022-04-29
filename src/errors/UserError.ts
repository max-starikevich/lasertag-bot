export enum UserErrorCodes {
  EMPTY_LIST = 'EMPTY_LIST',
  NOT_ENOUGH_PLAYERS = 'NOT_ENOUGH_PLAYERS',
  WRONG_COMMAND = 'WRONG_COMMAND'
}

export class UserError extends Error {
  constructor (public message: string, public code: UserErrorCodes) {
    super(message)
  }
}
