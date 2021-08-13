import { updatePlayerCount } from './tableManager';
import { SheetsClient, ValueRange } from '../types';
import { HandledError } from '../errors';

const getSheetsClient = async () => {
  const tableData: { [key: string]: ValueRange } = {
    'B5:B10': {
      range: 'B5:B10',
      values: [['test1'], ['test2'], ['test3'], ['test4'], ['test5']]
    },
    'C5:C10': {
      range: 'C5:C10',
      values: [['2'], [''], [''], ['1']]
    },
    'D5:D10': {
      range: 'D5:D10',
      values: [['2']]
    }
  };

  const sheetsClient: SheetsClient = {
    get: async (ranges) => {
      return ranges.map((range) => tableData[range] || null);
    },
    set: async (data) => {
      data.map(({ range, values }) => {
        if (!range) {
          return;
        }
        tableData[range] = { range, values };
      });
    }
  };

  return sheetsClient;
};

describe('Table manager module', () => {
  describe('#updatePlayerCount', () => {
    it('should update the table and not throw any exception', async () => {
      const sheetsClient = await getSheetsClient();

      const usernameRange = 'B5:B10';
      const countRange = 'C5:C10';
      const weaponsRange = 'D5:D10';

      const username = 'test2';
      const playerCount = 3;
      const weaponsCount = 3;

      await updatePlayerCount({
        sheetsClient,
        usernameRange,
        countRange,
        weaponsRange,
        username,
        playerCount,
        weaponsCount
      });

      const expectedRanges: ValueRange[] = [
        {
          range: 'B5:B10',
          values: [['test1'], ['test2'], ['test3'], ['test4'], ['test5']]
        },
        {
          range: 'C5:C10',
          values: [['2'], ['3'], [''], ['1'], ['']]
        },
        {
          range: 'D5:D10',
          values: [['2'], ['3'], [''], [''], ['']]
        }
      ];

      const resultRanges = await sheetsClient.get([
        usernameRange,
        countRange,
        weaponsRange
      ]);

      expect(resultRanges).toEqual(expectedRanges);
    });

    it('should throw an error, if username cannot be found', async () => {
      const sheetsClient = await getSheetsClient();

      const usernameRange = 'B5:B10';
      const countRange = 'C5:C10';
      const weaponsRange = 'D5:D10';

      const username = 'test100'; // doesn't exist
      const playerCount = 3;
      const weaponsCount = 3;

      const updatePromise = updatePlayerCount({
        sheetsClient,
        usernameRange,
        countRange,
        weaponsRange,
        username,
        playerCount,
        weaponsCount
      });

      const expectedError = new HandledError(
        `@${username} не найден в таблице`
      );

      await expect(updatePromise).rejects.toEqual(expectedError);
    });
  });
});
