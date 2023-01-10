import { CustomError } from './CustomError'

export class NoHomeChatAccessError extends CustomError {
  public message = 'This user does not have enough permissions'
  public replyMessage = 'Недостаточно прав. Вы должны состоять в нашем ламповом чате 🤷'
  public shouldBeReported = false
}
