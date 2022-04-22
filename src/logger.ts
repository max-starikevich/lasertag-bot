import { Format } from 'logform'
import { createLogger, format, transports } from 'winston'

import config from '$/config'

const { combine, timestamp, errors, printf, prettyPrint } = format

export enum ActionKind {
  PROCESSED_OK = 'PROCESSED_OK',
  PROCESSED_NOT_OK = 'PROCESSED_NOT_OK',
  DOCUMENT_LOADED = 'DOCUMENT_LOADED',
  SHEETS_LOADED = 'SHEETS_LOADED',
  UNKNOWN_COMMAND = 'UNKNOWN_COMMAND'
}

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
