import { createLogger, transports, format } from 'winston';

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss' }),
    format.printf((data) =>
      JSON.stringify({
        level: data.level,
        timestamp: data.timestamp,
        message: data.message
      })
    )
  ),
  transports: [new transports.Console()]
});
