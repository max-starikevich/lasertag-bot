export const escapeHtml = (unsafeString = ''): string =>
  unsafeString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

export const getRandomOneOrZero = (): number => (Math.random() > 0.5 ? 1 : 0)

export const parseJsonSafe = (json: string): any => {
  try {
    const data = JSON.parse(json)
    return data
  } catch (e) {
    return null
  }
}

export const getDateDiffInSeconds = (a: Date, b: Date): number => {
  const diff = a.getTime() - b.getTime()

  return diff / 1000
}
