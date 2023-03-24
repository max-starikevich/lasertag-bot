import { Translation } from './i18n-types'

export type MappedTranslation = { [key in keyof Translation]: string }
