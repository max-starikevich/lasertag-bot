import { IGameStore, StoreData } from '$/game/storage/types'

export const getTestStore = (): IGameStore => {
  const map = new Map<string, any>()

  return {
    async get <T>(keys: string[]): Promise<Array<StoreData<T>>> {
      return keys.map(key => ({
        key, value: map.get(key)
      }))
    },

    async set <T>(data: Array<StoreData<T>>): Promise<void> {
      for (const { key, value } of data) {
        if (value === null) {
          continue
        }

        map.set(key, value)
      }
    },

    async delete (keys): Promise<void> {
      for (const key of keys) {
        map.delete(key)
      }
    },

    async loadDebugInfo (): Promise<object> {
      return {
        debug: 'some data'
      }
    }
  }
}
