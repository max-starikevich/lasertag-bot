import dedent from 'dedent-js';

import { author, version, repository } from '../../package.json';
import { BotContext } from '@/types';
import { escapeHtml } from '@/utils';

export default (ctx: BotContext) => {
  return ctx.replyWithHTML(dedent`
    <b>Telegram-бот для лазертага</b>

    Версия: ${version}

    Автор: ${escapeHtml(author)}

    Исходный код: ${repository}
  `);
};
