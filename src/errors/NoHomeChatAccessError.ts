import { TranslationFunctions } from '$/lang/i18n-types'
import { CustomError } from './CustomError'

export class NoHomeChatAccessError extends CustomError {
  public message = 'This user does not have enough permissions'
  public replyMessage: (lang: TranslationFunctions) => string = lang => lang.NO_HOME_CHAT_ACCESS_MESSAGE()
  public shouldBeReported = false
}
