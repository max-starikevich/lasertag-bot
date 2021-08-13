import { Context } from 'telegraf';

export default async (ctx: Context): Promise<void> => {
  const helpMessage = `Hello!`;

  await ctx.replyWithMarkdown(helpMessage);
};
