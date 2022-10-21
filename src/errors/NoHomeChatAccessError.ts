import { CustomError } from './CustomError'

export class NoHomeChatAccessError extends CustomError {
  public message = 'This user does not belong to the home chat'
  public replyMessage = 'Нет доступа.'
}
