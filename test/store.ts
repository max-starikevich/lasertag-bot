import { IKeyValueStore, KeyValue } from '$/features/key-value/types'

export const keyValueFactory = async (): Promise<IKeyValueStore> => {
  const map = new Map<string, any>()

  return {
    async get <T>(keys: string[]): Promise<Array<KeyValue<T>>> {
      return keys.map(key => ({
        key, value: map.get(key)
      }))
    },

    async set <T>(data: Array<KeyValue<T>>): Promise<void> {
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
    }
  }
}
