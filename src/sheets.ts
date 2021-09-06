import { GoogleSpreadsheet } from 'google-spreadsheet';

import config from '@/config';
import { escapeHtml } from '@/utils';
import { Player } from '@/player';

const {
  NAME_COLUMN,
  USERNAME_COLUMN,
  COUNT_COLUMN,
  RENT_COLUMN,
  COMMENT_COLUMN,
  LEVEL_COLUMN,
  START_FROM_ROW,
  MAX_ROW_NUMBER,
  DEFAULT_PLAYER_LEVEL,
  PLACE_AND_TIME_CELLS
} = config;

const PLAYER_DATA_RANGES = [
  NAME_COLUMN,
  USERNAME_COLUMN,
  COUNT_COLUMN,
  RENT_COLUMN,
  COMMENT_COLUMN,
  LEVEL_COLUMN
]
  .filter((columnName) => !!columnName)
  .map((column) => `${column}${START_FROM_ROW}:${column}${MAX_ROW_NUMBER}`);

export const getSpreadsheetDocument = () => {
  const document = new GoogleSpreadsheet(config.GOOGLE_SPREADSHEET_ID);
  document.useApiKey(config.GOOGLE_API_KEY);
  return document;
};

export const getActivePlayers = async (document: GoogleSpreadsheet) => {
  await document.loadInfo();
  const sheet = document.sheetsByIndex[0];

  await sheet.loadCells(PLAYER_DATA_RANGES);

  const activePlayers: Player[] = [];

  for (let row = START_FROM_ROW; row < MAX_ROW_NUMBER; row++) {
    const player: Player = {
      name: escapeHtml(
        sheet
          .getCellByA1(NAME_COLUMN + row)
          .value?.toString()
          .trim()
      ),
      count: +sheet.getCellByA1(COUNT_COLUMN + row).value || 0,
      rentCount: +sheet.getCellByA1(RENT_COLUMN + row).value || 0,
      comment: escapeHtml(
        sheet
          .getCellByA1(COMMENT_COLUMN + row)
          .value?.toString()
          .trim()
      ),
      level:
        +sheet.getCellByA1(LEVEL_COLUMN + row).value || DEFAULT_PLAYER_LEVEL
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
          name: player.name + (!isFirst ? ` (${i})` : ''),
          count: 1,
          rentCount: rentCount > 0 ? 1 : 0,
          comment: isFirst ? player.comment : '',
          level: isFirst ? player.level : DEFAULT_PLAYER_LEVEL
        });
      }
    }
  }

  return activePlayers;
};

export const getPlaceAndTime = async (document: GoogleSpreadsheet) => {
  await document.loadInfo();
  const sheet = document.sheetsByIndex[0];
  await sheet.loadCells(PLACE_AND_TIME_CELLS);

  return PLACE_AND_TIME_CELLS.map((cell) =>
    sheet.getCellByA1(cell).value.toString()
  ).join(', ');
};
