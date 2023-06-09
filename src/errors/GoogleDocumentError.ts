import { TranslationFunctions } from '$/lang/i18n-types'
import { CustomError } from './CustomError'

export class GoogleDocumentError extends CustomError {
  public message = 'Something is wrong with Google document.'
  public replyMessage: (lang: TranslationFunctions) => string = lang => lang.SHEETS_ERROR()
  public shouldBeReported = true
}
