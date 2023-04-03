import { Translation, Locales } from './i18n-types'

export type MappedTranslation = { [key in keyof Translation]: string }

export const defaultLocale: Locales = 'by'
