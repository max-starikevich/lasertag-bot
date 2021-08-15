import { BotContext } from '@/types';

export default async (ctx: BotContext): Promise<void> => {
  await ctx.reply('Список доступных команд доступен через /commands.');
};
