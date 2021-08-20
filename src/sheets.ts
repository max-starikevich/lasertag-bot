import { GoogleSpreadsheet } from 'google-spreadsheet';

interface Player {
  name: string;
  count: number;
}

export const getActivePlayers = async (document: GoogleSpreadsheet) => {
  await document.loadInfo();
  const sheet = document.sheetsByIndex[0];
  await sheet.loadCells(['A3:A100', 'C3:C100']);

  const activePlayers: Player[] = [];

  for (let i = 2; i < 100; i++) {
    const player = {
      name: sheet.getCell(i, 0).value?.toString().trim(),
      count: +sheet.getCell(i, 2).value
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
  await sheet.loadCells('C1');

  return sheet.getCell(0, 2).value.toString();
};
