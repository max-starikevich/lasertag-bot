import { Context } from 'telegraf';

export default async (ctx: Context): Promise<void> => {
  const helpMessage = `Привет!`;

  await ctx.replyWithMarkdown(helpMessage);
};
