import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Player } from '@/types';

const CELLS_TO_LOAD = 'A1:D100';

export const getActivePlayers = async (document: GoogleSpreadsheet) => {
  await document.loadInfo();
  const sheet = document.sheetsByIndex[0];
  await sheet.loadCells(CELLS_TO_LOAD);

  const activePlayers: Player[] = [];

  // TODO: move these numbers to config/env somehow
  for (let rowIndex = 2; rowIndex < 100; rowIndex++) {
    const player = {
      name: sheet.getCell(rowIndex, 0).value?.toString().trim(),
      count: +sheet.getCell(rowIndex, 2).value
    };

    if (player.count === 1) {
      activePlayers.push(player);
    }

    if (player.count > 1) {
      for (let i = 1; i <= player.count; i++) {
        activePlayers.push({
          name: `${player.name} [${i}]`,
          count: 1
        });
      }
    }
  }

  return activePlayers;
};

export const getPlaceAndTime = async (document: GoogleSpreadsheet) => {
  await document.loadInfo();
  const sheet = document.sheetsByIndex[0];
  await sheet.loadCells(CELLS_TO_LOAD);

  return sheet.getCell(0, 2).value.toString();
};
