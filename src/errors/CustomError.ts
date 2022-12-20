export abstract class CustomError extends Error {
  public abstract message: string
  public abstract replyMessage: string
  public abstract shouldBeReported: boolean

  public cause?: any

  constructor (cause?: any) {
    super()
    this.cause = cause
  }
}
