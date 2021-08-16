import { Markup } from 'telegraf';
import { chunk } from 'lodash';

import { actions } from '@/actions/index';
import { BotContext } from '@/types';

const commandsToHide = ['/start', '/version'];

export default (ctx: BotContext) => {
  const commandsToDisplay = actions
    .map(({ command }) => command)
    .filter((command) => !commandsToHide.includes(command));

  return ctx.reply(
    'Доступные команды:',
    Markup.keyboard(chunk(commandsToDisplay, 2)).oneTime().resize()
  );
};
