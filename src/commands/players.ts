import dedent from 'dedent-js';

import { BotContext } from '@/types';
import { HandledError } from '@/errors';
import { getActivePlayers, getPlaceAndTime } from '@/sheets';

export default async (ctx: BotContext) => {
  const { document } = ctx;

  if (!document) {
    throw new HandledError(`Не удалось прочитать таблицу`);
  }

  const activePlayers = await getActivePlayers(document);

  if (activePlayers.length === 0) {
    return ctx.reply('Пока что никто не записан');
  }

  const placeAndTime = await getPlaceAndTime(document);

  return ctx.replyWithMarkdown(
    dedent`
      *${placeAndTime}*

      ${activePlayers
        .map(
          (player, i) =>
            `${i + 1}) ${player.name} ${
              player.count > 1 ? `[${player.count}]` : ``
            }`
        )
        .join('\n')}
    `
  );
};
