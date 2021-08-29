import dedent from 'dedent-js';

import { UserError } from '@/errors';
import { BotContext } from '@/bot';
import { getActivePlayers, getPlaceAndTime } from '@/sheets';
import { getBalancedTeams } from '@/player';

export default async (ctx: BotContext) => {
  const { document } = ctx;

  if (!document) {
    throw new UserError(`Не удалось прочитать таблицу`);
  }

  const activePlayers = await getActivePlayers(document);

  if (activePlayers.length < 8) {
    throw new UserError(
      'Записано меньше 8 человек. Делить меньшее количество бессмысленно.'
    );
  }

  const placeAndTime = await getPlaceAndTime(document);

  const [team1, team2] = getBalancedTeams(activePlayers);

  return ctx.replyWithHTML(
    dedent`
      <b>${placeAndTime}</b>

      Команда 1 (${team1.length})
      ${team1.map((player) => `- ${player.name}`).join('\n')}

      Команда 2 (${team2.length})
      ${team2.map((player) => `- ${player.name}`).join('\n')}
    `
  );
};
