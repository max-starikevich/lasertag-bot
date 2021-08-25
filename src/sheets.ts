import { GoogleSpreadsheet } from 'google-spreadsheet';

import config from '@/config';
import { escapeHtml } from '@/utils';
import { Player } from '@/types';

export const getSpreadsheetDocument = () => {
  const document = new GoogleSpreadsheet(config.GOOGLE_SPREADSHEET_ID);
  document.useApiKey(config.GOOGLE_API_KEY);
  return document;
};

const DEFAULT_GROUP_NAME = '0';
const IS_LATE_SYMBOL = '*';

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
    const player = {
      name: escapeHtml(sheet.getCell(i, 0).value?.toString().trim()),
      count: +sheet.getCell(i, 2).value,
      rentCount: +sheet.getCell(i, 3).value,
      comment: escapeHtml(sheet.getCell(i, 4).value?.toString().trim()),
      isLate: sheet.getCell(i, 7).value?.toString().trim() === IS_LATE_SYMBOL,
      group: sheet.getCell(i, 21).value?.toString().trim() || DEFAULT_GROUP_NAME
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
          name: `${player.name} ${isFirst ? `[${i}]` : ''}`,
          count: 1,
          rentCount: rentCount > 0 ? 1 : 0,
          comment: isFirst ? player.comment : '',
          group: isFirst ? player.group : DEFAULT_GROUP_NAME
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
