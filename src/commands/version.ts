import dedent from 'dedent-js';

import { BotContext } from '@/types';
import config from '@/config';

export default (ctx: BotContext) => {
  return ctx.reply(dedent`
    Версия: ${config.VERSION}
    Коммит: ${config.COMMIT_HASH}
  `);
};
