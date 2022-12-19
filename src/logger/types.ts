export interface BaseLogger {
  info: (...data: any) => void
  warn: (...data: any) => void
  error: (...data: any) => void
}
