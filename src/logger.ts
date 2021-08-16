import { createLogger, transports, format } from 'winston';
import config from './config';

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss' }),
    format.printf((data) =>
      JSON.stringify({
        level: data.level,
        timestamp: data.timestamp,
        message: data.message,
        pm2NodeId: config.PM2_NODE_ID
      })
    )
  ),
  transports: [new transports.Console()]
});
