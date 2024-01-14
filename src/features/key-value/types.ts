export interface IKeyValueStore {
  get: <T>(keys: string[]) => Promise<Array<KeyValue<T>>>
  set: <T>(objects: Array<KeyValue<T>>) => Promise<void>
  delete: (keys: string[]) => Promise<void>
}

export interface KeyValue<T> {
  key: string
  value: T | null
}
