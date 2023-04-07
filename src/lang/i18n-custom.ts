import { Translation, Locales } from './i18n-types'

export type MappedTranslation = { [key in keyof Translation]: string }

export const defaultLocale: Locales = 'by'

export const localeNames: Locales[] = ['by', 'ru', 'en']

export const isLocaleName = (maybeLocale?: string): Boolean => localeNames.includes(maybeLocale as Locales)
