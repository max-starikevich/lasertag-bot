import { BaseLogger } from '$/logger/types'

export interface BaseTable {
  refreshData: ({ logger }: { logger: BaseLogger }) => Promise<void>
  get: (a1: string) => string | undefined
  set: (a1: string, value: string) => void
  save: () => Promise<void>
}
