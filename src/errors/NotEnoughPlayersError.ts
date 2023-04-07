import { TranslationFunctions } from '$/lang/i18n-types'
import { CustomError } from './CustomError'

export class NotEnoughPlayersError extends CustomError {
  public message = 'Not enough players for this function'
  public replyMessage: (lang: TranslationFunctions) => string = lang => lang.NOT_ENOUGH_PLAYERS()
  public shouldBeReported = false
}
