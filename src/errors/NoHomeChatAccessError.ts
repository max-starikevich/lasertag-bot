import { CustomError } from './CustomError'

export class NoHomeChatAccessError extends CustomError {
  public message: string = 'This user does not belong to the home chat'
  public replyMessage: string = 'Нет доступа.'
}
