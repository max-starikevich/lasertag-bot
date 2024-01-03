import { TranslationFunctions } from '$/lang/i18n-types'
import { CustomError } from './CustomError'

export class AiError extends CustomError {
  public message = 'Something is wrong with AI'
  public replyMessage: (lang: TranslationFunctions) => string = lang => lang.AI_ERROR_MESSAGE()
  public shouldBeReported = true
}
