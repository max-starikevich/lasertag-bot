import { Locales } from '$/lang/i18n-types'

export interface GameLocation {
  location: string
  date: string

  lang: Locales
}

export interface GameLink {
  url: string
  description: string

  lang: Locales
}
