import { TranslationFunctions } from '$/lang/i18n-types'
import { CustomError } from './CustomError'

export class AccessDeniedError extends CustomError {
  public message = 'This user does not have enough permissions'
  public replyMessage: (lang: TranslationFunctions) => string = lang => lang.ACCESS_DENIED()
  public shouldBeReported = false
}
