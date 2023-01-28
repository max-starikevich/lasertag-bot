import { TranslationFunctions } from '$/lang/i18n-types'
import { CustomError } from './CustomError'

export class GroupChatForbiddenError extends CustomError {
  public message = 'This user cannot communicate with bot in the group'
  public replyMessage: (lang: TranslationFunctions) => string = lang => lang.GROUP_CHAT_WARNING()
  public shouldBeReported = false
}
