import { groupBy, shuffle } from 'lodash';
import dedent from 'dedent-js';

import { HandledError } from '@/errors';
import { BotContext, Player } from '@/types';
import { getActivePlayers, getPlaceAndTime } from '@/sheets';
import { getRandomizedTeams } from '@/utils';

export default async (ctx: BotContext) => {
  const { document } = ctx;

  if (!document) {
    throw new HandledError(`Не удалось прочитать таблицу`);
  }

  const activePlayers = await getActivePlayers(document);

  if (activePlayers.length < 2) {
    return ctx.reply('Записано меньше двух человек');
  }

  const placeAndTime = await getPlaceAndTime(document);

  const latePlayers = activePlayers.filter(({ isLate }) => isLate);

  const groupedPlayers = groupBy<Player>(
    activePlayers.filter(({ isLate }) => !isLate),
    (player) => player.group
  );

  const groups = Object.keys(groupedPlayers);

  const [team1, team2] = groups.reduce(
    ([resultTeam1, resultTeam2], groupName) => {
      const players = groupedPlayers[groupName];

      // groupTeam1 is always bigger or equal to groupTeam2
      const [groupTeam1, groupTeam2] = getRandomizedTeams(players);

      if (resultTeam1.length > resultTeam2.length) {
        return [
          [...resultTeam1, ...groupTeam2],
          [...resultTeam2, ...groupTeam1]
        ];
      } else {
        return [
          [...resultTeam1, ...groupTeam1],
          [...resultTeam2, ...groupTeam2]
        ];
      }
    },
    [[], []] as Player[][]
  );

  return ctx.replyWithHTML(
    dedent`
      <b>${placeAndTime}</b>

      Команда 1 (${team1.length})
      ${shuffle(team1)
        .map((player) => `- ${player.name}`)
        .join('\n')}

      Команда 2 (${team2.length})
      ${shuffle(team2)
        .map((player) => `- ${player.name}`)
        .join('\n')}

      ${
        latePlayers.length > 0
          ? dedent`
              Опаздывают (${latePlayers.length})
              ${latePlayers.map((player) => `- ${player.name}`).join('\n')}
            `
          : ''
      }
    `
  );
};
