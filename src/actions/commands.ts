import { Context, Markup } from 'telegraf';
import { chunk } from 'lodash';

import { actions } from './index';

const commandsToHide = ['/start'];

export default async (ctx: Context): Promise<void> => {
  const commandsToDisplay = actions
    .map(({ command }) => command)
    .filter((command) => !commandsToHide.includes(command));

  await ctx.reply(
    'Доступные команды:',
    Markup.keyboard(chunk(commandsToDisplay, 2)).oneTime().resize()
  );
};
