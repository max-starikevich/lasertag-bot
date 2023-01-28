import { TranslationFunctions } from '$/lang/i18n-types'

export abstract class CustomError extends Error {
  public abstract message: string
  public abstract replyMessage: (lang: TranslationFunctions) => string
  public shouldBeReported: boolean

  public cause?: any

  constructor (cause?: any) {
    super()
    this.cause = cause
    this.shouldBeReported = cause != null
  }
}
