import { GoogleSpreadsheet } from 'google-spreadsheet';

import config from '@/config';
import { escapeHtml } from '@/utils';
import { flattenPlayer, Player } from '@/player';

export const getSpreadsheetDocument = () => {
  const document = new GoogleSpreadsheet(config.GOOGLE_SPREADSHEET_ID);
  document.useApiKey(config.GOOGLE_API_KEY);
  return document;
};

export const getActivePlayers = async (document: GoogleSpreadsheet) => {
  await document.loadInfo();
  const sheet = document.sheetsByIndex[0];

  await sheet.loadCells([
    'A3:A100',
    'C3:C100',
    'D3:D100',
    'E3:E100',
    'H3:H100',
    'V3:V100'
  ]);

  const activePlayers: Player[] = [];

  for (let i = 2; i < 100; i++) {
    const player: Player = {
      name: escapeHtml(sheet.getCell(i, 0).value?.toString().trim()),
      count: +sheet.getCell(i, 2).value,
      rentCount: +sheet.getCell(i, 3).value,
      comment: escapeHtml(sheet.getCell(i, 4).value?.toString().trim()),
      level: +sheet.getCell(i, 21).value || config.DEFAULT_PLAYER_LEVEL
    };

    activePlayers.push(...flattenPlayer(player));
  }

  return activePlayers;
};

export const getPlaceAndTime = async (document: GoogleSpreadsheet) => {
  await document.loadInfo();
  const sheet = document.sheetsByIndex[0];
  await sheet.loadCells('C1');

  return sheet.getCell(0, 2).value.toString();
};
