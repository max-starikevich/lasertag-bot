import { Context, Markup } from 'telegraf';

export default async (ctx: Context): Promise<void> => {
  await ctx.reply(
    'Выберите одну из доступных ниже команд:',
    Markup.keyboard(['🪄 Составы']).oneTime().resize()
  );
};
