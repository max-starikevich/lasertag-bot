import { shuffle } from 'lodash';

import { Player } from '@/types';

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const escapeHtml = (unsafe = '') =>
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const getRandomizedTeams = (players: Player[]): [Player[], Player[]] => {
  const randomizedPlayers = shuffle(players);
  const half = Math.ceil(randomizedPlayers.length / 2);

  const team1 = randomizedPlayers.splice(0, half);
  const team2 = randomizedPlayers.splice(-half);

  return [team1, team2];
};
