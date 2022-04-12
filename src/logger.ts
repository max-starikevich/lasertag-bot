import { createLogger, format, transports } from 'winston'

const { combine, timestamp, errors, printf, prettyPrint } = format

export const logger = createLogger({
  format: combine(
    errors({ stack: true }),
    timestamp(),
    printf((info) =>
      JSON.stringify({
        level: info.level,
        message: info.message,
        stack: info.stack,
        timestamp: info.timestamp
      })
    ),
    prettyPrint()
  ),
  transports: [new transports.Console()]
})
