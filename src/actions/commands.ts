import { chunk } from 'lodash';
import { Markup } from 'telegraf';

import { actions } from '@/actions/index';
import { BotContext } from '@/types';

const commandsToHide = ['/start', '/version', '/commands'];

export default (ctx: BotContext) => {
  const commandsToDisplay = actions.filter(
    ({ command }) => !commandsToHide.includes(command)
  );

  return ctx.reply(
    `
Доступные команды:

${commandsToDisplay
  .map(
    ({ command, description }) => `${command} - ${description.toLowerCase()}`
  )
  .join('\n')}
  `,
    Markup.keyboard(
      chunk(
        commandsToDisplay.map(({ command }) => command),
        2
      )
    )
      .oneTime()
      .resize()
  );
};
