import { GoogleSpreadsheet } from 'google-spreadsheet';

import config from '@/config';
import { escapeHtml } from '@/utils';
import { Player } from '@/player';

export const getSpreadsheetDocument = () => {
  const document = new GoogleSpreadsheet(config.GOOGLE_SPREADSHEET_ID);
  document.useApiKey(config.GOOGLE_API_KEY);
  return document;
};

const PLAYER_DATA_RANGES = [
  config.NAME_COLUMN,
  config.USERNAME_COLUMN,
  config.COUNT_COLUMN,
  config.RENT_COLUMN,
  config.COMMENT_COLUMN,
  config.LEVEL_COLUMN
]
  .filter((columnName) => !!columnName)
  .map(
    (column) =>
      `${column}${config.START_FROM_ROW}:${column}${config.MAX_ROW_NUMBER}`
  );

export const getActivePlayers = async (document: GoogleSpreadsheet) => {
  await document.loadInfo();
  const sheet = document.sheetsByIndex[0];

  await sheet.loadCells(PLAYER_DATA_RANGES);

  const activePlayers: Player[] = [];

  for (let row = config.START_FROM_ROW; row < config.MAX_ROW_NUMBER; row++) {
    const player: Player = {
      name: escapeHtml(
        sheet
          .getCellByA1(`${config.NAME_COLUMN}${row}`)
          .value?.toString()
          .trim()
      ),
      count: +sheet.getCellByA1(`${config.COUNT_COLUMN}${row}`).value || 0,
      rentCount: +sheet.getCellByA1(`${config.RENT_COLUMN}${row}`).value || 0,
      comment: escapeHtml(
        sheet
          .getCellByA1(`${config.COMMENT_COLUMN}${row}`)
          .value?.toString()
          .trim()
      ),
      level:
        +sheet.getCellByA1(`${config.LEVEL_COLUMN}${row}`).value ||
        config.DEFAULT_PLAYER_LEVEL
    };

    if (player.count === 1) {
      activePlayers.push(player);
    }

    if (player.count > 1) {
      for (
        let i = 1, rentCount = player.rentCount;
        i <= player.count;
        i++, rentCount--
      ) {
        const isFirst = i === 1;

        activePlayers.push({
          ...player,
          name: `${player.name}${!isFirst ? ` (${i})` : ''}`,
          count: 1,
          rentCount: rentCount > 0 ? 1 : 0,
          comment: isFirst ? player.comment : '',
          level: isFirst ? player.level : config.DEFAULT_PLAYER_LEVEL
        });
      }
    }
  }

  return activePlayers;
};

export const getPlaceAndTime = async (document: GoogleSpreadsheet) => {
  await document.loadInfo();
  const sheet = document.sheetsByIndex[0];
  await sheet.loadCells('C1');

  return sheet.getCell(0, 2).value.toString();
};
