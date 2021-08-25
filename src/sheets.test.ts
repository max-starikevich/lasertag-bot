import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet
} from 'google-spreadsheet';

import { getPlaceAndTime } from '@/sheets';

describe('Sheets module', () => {
  describe('getPlaceAndTime()', () => {
    it('should return place and time from the Google Spreadsheet', async () => {
      const data = [['', '', 'Среда 19:00 Гонолес']];

      const sheet = {
        loadCells: async () => {
          // do nothing
        },
        getCell: (rowIndex: number, columnIndex: number) => ({
          value: data[rowIndex][columnIndex]
        })
      } as unknown as GoogleSpreadsheetWorksheet;

      const document = {
        loadInfo: () => {
          // do nothing
        },
        sheetsByIndex: [sheet]
      } as GoogleSpreadsheet;

      const placeAndTime = await getPlaceAndTime(document);

      expect(placeAndTime).toEqual(data[0][2]);
    });
  });
});
