import crypto from 'node:crypto'

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

export const extractNumber = (data: any): number | undefined => {
  if (data == null) {
    return undefined
  }

  const n = Number(String(data).replace('?', ''))

  if (Number.isNaN(n)) {
    return undefined
  }

  return n
}

export interface ParsedRange {
  raw: string
  from: { letter: string, num: number }
  to: { letter: string, num: number }
}

export const parseRange = (s?: string): ParsedRange => {
  const input = String(s)
  const regexResult = /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/.exec(input)

  if (regexResult === null) {
    throw new Error(`Failed to parse range for ${String(s)}`)
  }

  return {
    raw: input,
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

export const stringToSha1 = (s: string): string =>
  crypto.createHash('sha1').update(s).digest('hex')

export const stringToBase64 = (s: string): string => Buffer.from(s, 'ascii').toString('base64')
export const base64ToString = (s: string): string => Buffer.from(s, 'base64').toString('ascii')
