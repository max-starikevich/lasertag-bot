import { TranslationFunctions } from '$/lang/i18n-types'
import { CustomError } from './CustomError'

export class NoFreeRowsToRegisterError extends CustomError {
  public message = 'No free rows in the table to register'
  public replyMessage: (lang: TranslationFunctions) => string = lang => lang.REGISTER_NO_FREE_ROWS()
  public shouldBeReported = false
}
