import handler from '@/commands/playerlist';
import { UserError } from '@/errors';
import { BotContext } from '@/bot';

describe('Command /playerlist', () => {
  it('should throw a user error, if there is no "document" object in the context', () => {
    const context = {} as BotContext;

    handler(context).catch((e) => {
      expect(e).toBeInstanceOf(UserError);
      expect(e.message).toEqual('Не удалось прочитать таблицу');
    });
  });
});
