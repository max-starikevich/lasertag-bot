export interface ITable {
  refreshData: () => Promise<void>
  get: (a1: string) => string
}
