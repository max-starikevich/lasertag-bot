export const escapeHtml = (unsafeString = ''): string =>
  unsafeString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

export const parseJsonSafe = (json: string): any => {
  try {
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

export const getRandomArray = (length: number, max: number): number[] => [...new Array(length)]
  .map(() => Math.round(Math.random() * max))
