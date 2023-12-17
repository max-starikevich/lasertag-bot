import { Translation, Locales } from './i18n-types'

export type MappedTranslation = { [key in keyof Translation]: string }

export const localeNames: Locales[] = ['by', 'ua', 'pl', 'en', 'ru']
export const extractLocale = (maybeLocale?: string): Locales | undefined => localeNames.find(localeName => maybeLocale === localeName)
