import { createLogger, format, transports } from 'winston';

const { combine, timestamp, errors, prettyPrint } = format;

export const logger = createLogger({
  format: combine(errors({ stack: true }), timestamp(), prettyPrint()),
  transports: [new transports.Console()]
});
