import { BotContext } from '@/types';
import config from '@/config';

export default async (ctx: BotContext): Promise<void> => {
  await ctx.reply(`Версия: ${config.VERSION}`);
};
