import { config } from '$/config'
import { FeatureUnavailableError } from '$/errors/FeatureUnavailableError'

import { GoogleSheetsKeyValue } from './GoogleSheetsKeyValue'
import { IKeyValueStore } from './types'

let store: IKeyValueStore

export const keyValueFactory = async (): Promise<IKeyValueStore> => {
  if (
    config.GOOGLE_SERVICE_ACCOUNT_EMAIL === undefined ||
    config.GOOGLE_PRIVATE_KEY === undefined ||
    config.STORE_DOC_ID === undefined ||
    config.STORE_SHEETS_ID === undefined
  ) {
    throw new FeatureUnavailableError()
  }

  if (store === undefined) {
    store = new GoogleSheetsKeyValue({
      email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: config.GOOGLE_PRIVATE_KEY,
      docId: config.STORE_DOC_ID,
      sheetsId: config.STORE_SHEETS_ID
    })
  }

  return store
}
