import { SheetsClient, ValueRange } from '../types';
import { HandledError } from '../errors';

interface UpdateParams {
  sheetsClient: SheetsClient;
  username: string;
  playerCount: number;
  weaponsCount: number;
  countRange: string;
  usernameRange: string;
  weaponsRange: string;
}

export const updatePlayerCount = async ({
  countRange,
  usernameRange,
  weaponsRange,
  sheetsClient,
  username,
  playerCount,
  weaponsCount
}: UpdateParams): Promise<void> => {
  const [countData, usernameData, weaponsData] = await sheetsClient.get([
    countRange,
    usernameRange,
    weaponsRange
  ]);

  if (!usernameData || !usernameData.values || !usernameData.values.length) {
    throw new HandledError(
      `Не удалось найти список пользователей в ${usernameRange}`
    );
  }

  const targetIndex = usernameData.values.findIndex(
    (value) => value[0] === username
  );

  if (targetIndex === -1) {
    throw new HandledError(`@${username} не найден в таблице`);
  }

  const updatedCountData: ValueRange = {
    ...countData,
    values: usernameData.values.map((_, index) => {
      if (index === targetIndex) return [playerCount.toString()];
      return (countData && countData.values && countData.values[index]) || [''];
    })
  };

  const updatedWeaponsData: ValueRange = {
    ...weaponsData,
    values: usernameData.values.map((_, index) => {
      if (index === targetIndex) return [weaponsCount.toString()];
      return (
        (weaponsData && weaponsData.values && weaponsData.values[index]) || ['']
      );
    })
  };

  await sheetsClient.set([updatedCountData, updatedWeaponsData]);
};
