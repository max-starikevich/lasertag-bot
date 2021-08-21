import dedent from 'dedent-js';

import { BotContext } from '@/types';
import { commandsInMenu, menuKeyboard } from '@/commands/index';

export default (ctx: BotContext) => {
  return ctx.replyWithHTML(
    dedent`
      <b>Доступные команды</b>:

      ${commandsInMenu
        .map(
          ({ command, description }) =>
            `${command} - ${description.toLowerCase()}`
        )
        .join('\n\n')}
      `,
    menuKeyboard
  );
};
