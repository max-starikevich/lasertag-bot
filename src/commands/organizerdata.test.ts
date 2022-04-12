import handler from '$/commands/organizerdata'
import { UserError } from '$/errors'

describe('Command /organizerdata', () => {
  it('should throw a user error, if there is no "document" object in the context', () => {
    const context = {} as any

    handler(context).catch((e) => {
      expect(e).toBeInstanceOf(UserError)
      expect(e.message).toEqual('Не удалось прочитать таблицу')
    })
  })
})
