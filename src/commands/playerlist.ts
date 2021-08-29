import dedent from 'dedent-js';

import { BotContext } from '@/bot';
import { UserError } from '@/errors';
import { getActivePlayers, getPlaceAndTime } from '@/sheets';

export default async (ctx: BotContext) => {
  const { document } = ctx;

  if (!document) {
    throw new UserError(`Не удалось прочитать таблицу`);
  }

  const activePlayers = await getActivePlayers(document);

  if (activePlayers.length === 0) {
    throw new UserError('Никто не записан');
  }

  const placeAndTime = await getPlaceAndTime(document);

  return ctx.replyWithHTML(
    dedent`
      <b>${placeAndTime}</b>

      ${activePlayers.map(({ name }, i) => `${i + 1}) ${name}`).join('\n')}
    `
  );
};
