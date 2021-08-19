import dedent from 'dedent-js';

import { BotContext } from '@/types';
import { commandsInMenu, menuKeyboard } from './index';

export default (ctx: BotContext) => {
  return ctx.replyWithMarkdown(
    dedent`
      *Доступные команды*:

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
