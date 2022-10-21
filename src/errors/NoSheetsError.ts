import { CustomError } from './CustomError'

export class NoSheetsError extends CustomError {
  public message = 'Missing sheets data'
  public replyMessage = 'Документ недоступен. Повторите запрос позже.'
}
