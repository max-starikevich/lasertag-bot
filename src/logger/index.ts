import { Format } from 'logform'
import { createLogger, format, transports } from 'winston'

import config from '$/config'

const { combine, timestamp, errors, printf, prettyPrint } = format

const defaultFormats: Format[] = [
  errors({ stack: true }),
  timestamp(),
  printf(({ ...data }) => JSON.stringify({
    ...data
  }))
]

const devFormats: Format[] = [
  prettyPrint({ colorize: true })
]

export const logger = createLogger({
  format: combine(
    ...[
      ...defaultFormats,
      ...(config.isLocal ? devFormats : [])
    ]
  ),
  transports: [new transports.Console()]
})
