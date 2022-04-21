import command from '$/commands/playerlist'
import { ServiceError } from '$/errors'

describe('Command /playerlist', () => {
  it('should throw a user error, if there is no "document" object in the context', () => {
    const context = {} as any

    command.handler(context).catch((e) => {
      expect(e).toBeInstanceOf(ServiceError)
      expect(e.message).toEqual('Не удалось прочитать таблицу')
    })
  })
})
