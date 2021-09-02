import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet
} from 'google-spreadsheet';

import { getPlaceAndTime } from '@/sheets';
import config from '@/config';

describe('Sheets module', () => {
  describe('getPlaceAndTime()', () => {
    it('should return place and time from the Google Spreadsheet', async () => {
      const data: { [key: string]: string } = {
        [config.PLACE_AND_TIME_CELL]: 'Среда 19:00 Гонолес'
      };

      const sheet = {
        loadCells: async () => {
          // do nothing
        },
        getCellByA1: (a1: string) => ({
          value: data[a1]
        })
      } as unknown as GoogleSpreadsheetWorksheet;

      const document = {
        loadInfo: () => {
          // do nothing
        },
        sheetsByIndex: [sheet]
      } as GoogleSpreadsheet;

      const placeAndTime = await getPlaceAndTime(document);

      expect(placeAndTime).toEqual(data[config.PLACE_AND_TIME_CELL]);
    });
  });
});
