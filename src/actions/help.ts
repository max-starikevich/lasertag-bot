import { BotContext } from '@/types';

export default (ctx: BotContext) => {
  return ctx.reply('Список доступных команд доступен через /commands.');
};
