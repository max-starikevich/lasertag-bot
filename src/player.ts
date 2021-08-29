import { sortBy } from 'lodash';

import config from '@/config';

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
  return sortBy(players, ({ level }) => level)
    .reverse()
    .reduce(
      ([team1, team2], player, index) => {
        if (index % 2 === 0) {
          return [[...team1, player], team2];
        }
        return [team1, [...team2, player]];
      },
      [[], []] as Teams
    );
};
