export const escapeHtml = (unsafeString = '') =>
  unsafeString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const getRandomOneOrZero = () => (Math.random() > 0.5 ? 1 : 0);

export const parseJsonSafe = (json: string) => {
  try {
    const data = JSON.parse(json);
    return data;
  } catch (e) {
    return null;
  }
};
