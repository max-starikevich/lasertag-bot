import { TranslationFunctions } from '$/lang/i18n-types'
import { CustomError } from './CustomError'

export class AiWrongResponse extends CustomError {
  public message = 'Ai failed to respond with a proper data'
  public replyMessage: (lang: TranslationFunctions) => string = lang => lang.AI_WRONG_RESPONSE()
  public shouldBeReported = true
}
