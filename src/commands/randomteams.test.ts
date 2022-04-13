import handler from '$/commands/randomteams'
import { UserError } from '$/errors'

describe('Command /randomteams', () => {
  it('should throw a user error, if there is no "document" object in the context', () => {
    const context = {} as any

    handler(context).catch((e) => {
      expect(e).toBeInstanceOf(UserError)
      expect(e.message).toEqual('Не удалось прочитать таблицу')
    })
  })
})
