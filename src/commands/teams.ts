import { shuffle } from 'lodash';
import dedent from 'dedent-js';

import { HandledError } from '@/errors';
import { BotContext } from '@/types';
import { getActivePlayers, getPlaceAndTime } from '@/sheets';

export default async (ctx: BotContext) => {
  const { document } = ctx;

  if (!document) {
    throw new HandledError(`Не удалось прочитать таблицу`);
  }

  const activePlayers = await getActivePlayers(document);

  if (activePlayers.length === 0) {
    return ctx.reply('Пока никто не записан');
  }

  const placeAndTime = await getPlaceAndTime(document);
  const randomizedPlayers = shuffle(activePlayers);
  const half = Math.ceil(randomizedPlayers.length / 2);

  const team1 = randomizedPlayers.splice(0, half);
  const team2 = randomizedPlayers.splice(-half);

  return ctx.replyWithMarkdown(
    dedent`
      *${placeAndTime}*

      Команда 1 (${team1.length})
      ${team1
        .map((player, i) => `- ${player.name} ${i === 0 ? `⭐` : ''}`)
        .join('\n')}

      Команда 2 (${team2.length})
      ${team2
        .map((player, i) => `- ${player.name}  ${i === 0 ? `⭐` : ''}`)
        .join('\n')}
    `
  );
};
