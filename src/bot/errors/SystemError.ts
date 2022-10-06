export class SystemError extends Error {
  constructor (public message: string) {
    super(message)
  }
}
