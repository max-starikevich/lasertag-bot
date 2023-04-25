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
  if (data == null) {
    return undefined
  }

  const str = (String(data)).trim()

  if (str.length === 0) {
    return undefined
  }

  return str
}

export interface RangeParsed {
  from: { letter: string, num: number }
  to: { letter: string, num: number }
}

export const extractRange = (s?: string): RangeParsed | null => {
  const regexResult = /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/.exec(String(s))

  if (regexResult === null) {
    return null
  }

  return {
    from: {
      letter: regexResult[1],
      num: parseInt(regexResult[2])
    },
    to: {
      letter: regexResult[3],
      num: parseInt(regexResult[4])
    }
  }
}
