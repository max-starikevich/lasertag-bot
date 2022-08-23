export enum ServiceErrorCodes {
  NO_DOCUMENT_LOADED = 'NO_DOCUMENT_LOADED',
  NO_MESSAGE_IN_CTX = 'NO_MESSAGE_IN_CTX'
}

export class ServiceError extends Error {
  constructor (public message: string, public code: ServiceErrorCodes) {
    super(message)
  }
}
