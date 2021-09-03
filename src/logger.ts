import { createLogger, format, transports } from 'winston';

const { combine, timestamp, errors, printf } = format;

export const logger = createLogger({
  format: combine(
    errors({ stack: true }),
    timestamp(),
    printf((info) =>
      JSON.stringify({
        timestamp: info.timestamp,
        level: info.level,
        message: info.message,
        stack: info.stack
      })
    )
  ),
  transports: [new transports.Console()]
});
