export abstract class CustomError extends Error {
  public cause: any
  public message: string = 'CustomError occured. Try again later'
  public replyMessage: string | null = 'CustomError occured. Try again later'

  constructor (cause?: any) {
    super()
    this.cause = cause
  }
}
