import { register } from '$/bot/commands/register'
import { TranslationFunctions } from '$/lang/i18n-types'

import { CustomError } from './CustomError'

export class RegisterRequiredError extends CustomError {
  public message = 'The user needs to register first'
  public replyMessage: (lang: TranslationFunctions) => string = lang => lang.REGISTER_REQUIRED({ registerCommandName: register.name })
  public shouldBeReported = false
}
