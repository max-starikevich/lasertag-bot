import { TranslationFunctions } from '$/lang/i18n-types'

import { CustomError } from './CustomError'

export class StatsAlreadySavedError extends CustomError {
  public message = 'Stats for this game has been already saved'
  public replyMessage: (lang: TranslationFunctions) => string = lang => lang.STATS_ALREADY_SAVED()
  public shouldBeReported = false
}
