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
