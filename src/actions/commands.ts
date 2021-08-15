import { Markup } from 'telegraf';
import { chunk } from 'lodash';

import { actions } from '@/actions/index';
import { BotContext } from '@/types';

const commandsToHide = ['/start', '/version'];

export default async (ctx: BotContext): Promise<void> => {
  const commandsToDisplay = actions
    .map(({ command }) => command)
    .filter((command) => !commandsToHide.includes(command));

  await ctx.reply(
    'Доступные команды:',
    Markup.keyboard(chunk(commandsToDisplay, 2)).oneTime().resize()
  );
};
