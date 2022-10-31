import { ILogger } from '$/logger/types'

export interface ITable {
  refreshData: ({ logger }: { logger: ILogger }) => Promise<void>
  get: (a1: string) => string
}
