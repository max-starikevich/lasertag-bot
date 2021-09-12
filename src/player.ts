import { chunk, sortBy } from 'lodash';

import { getRandomOneOrZero } from './utils';

export interface Player {
  name: string;
  combinedName: string;
  count: number;
  rentCount: number;
  comment: string;
  level: number;
  isQuestionable: boolean;
  isCompanion: boolean;
}

export type Teams = [Player[], Player[]];

export const getBalancedTeams = (players: Player[]): Teams => {
  if (players.length < 2) {
    return [[...players], []];
  }

  const ratedPlayers = sortBy(players, ({ level }) => level).reverse();
  const playerPairs = chunk(ratedPlayers, 2);

  return playerPairs.reduce(
    ([team1, team2], [player1, player2]) => {
      if (!player2) {
        return [[...team1, player1], team2];
      }

      if (getRandomOneOrZero() === 1) {
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
