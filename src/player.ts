import { chunk, sortBy } from 'lodash';

import config from '@/config';
import { getRandomOneOrZero as tossCoin } from './utils';

export interface Player {
  name: string;
  count: number;
  rentCount: number;
  comment: string;
  level: number;
}

export type Teams = [Player[], Player[]];

export const flattenPlayer = (player: Player): Player[] => {
  if (player.count === 1) {
    return [player];
  }

  if (player.count > 1) {
    const players: Player[] = [];

    for (
      let i = 1, rentCount = player.rentCount;
      i <= player.count;
      i++, rentCount--
    ) {
      const isFirst = i === 1;

      players.push({
        ...player,
        name: `${player.name} ${!isFirst ? `[${i}]` : ''}`,
        count: 1,
        rentCount: rentCount > 0 ? 1 : 0,
        comment: isFirst ? player.comment : '',
        level: isFirst ? player.level : config.DEFAULT_PLAYER_LEVEL
      });
    }

    return players;
  }

  return [];
};

export const getBalancedTeams = (players: Player[]): Teams => {
  const ratedPlayers = sortBy(players, ({ level }) => level).reverse();
  const playerPairs = chunk(ratedPlayers, 2);

  return playerPairs.reduce(
    ([team1, team2], [player1, player2]) => {
      if (!player2) {
        return [[...team1, player1], team2];
      }

      if (tossCoin()) {
        return [
          [...team1, player1],
          [...team2, player2]
        ];
      }

      return [
        [...team1, player2],
        [...team2, player1]
      ];
    },
    [[], []] as Teams
  );
};
