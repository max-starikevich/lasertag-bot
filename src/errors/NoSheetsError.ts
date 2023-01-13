import { TranslationFunctions } from '$/lang/i18n-types'
import { CustomError } from './CustomError'

export class NoSheetsError extends CustomError {
  public message = 'Missing sheets data'
  public replyMessage: (lang: TranslationFunctions) => string = lang => lang.DOCUMENT_UNAVAILABLE_FOR_USER()
  public shouldBeReported = true
}
