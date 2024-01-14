import { TranslationFunctions } from '$/lang/i18n-types'

import { CustomError } from './CustomError'

export class FeatureUnavailableError extends CustomError {
  public message = 'This feature is not available'
  public replyMessage: (lang: TranslationFunctions) => string = lang => lang.FEATURE_UNAVAILABLE()
  public shouldBeReported = true
}
