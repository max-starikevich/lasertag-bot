import command from '@/commands/randomteams';
import { BotContext } from '@/types';

describe('Command /randomteams', () => {
  it('should fail, if there is no document in the context', () => {
    const context = {} as BotContext;

    command(context).catch((e) => {
      expect(e.message).toEqual('Не удалось прочитать таблицу');
    });
  });
});
