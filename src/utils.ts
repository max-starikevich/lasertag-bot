export const escapeHtml = (unsafeString = ''): string =>
  unsafeString
    .trim()
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

export const extractString = (data: any): string | undefined => {
  const str = (String(data)).trim()

  if (str.length === 0) {
    return undefined
  }

  return str
}
