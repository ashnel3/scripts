import { CommanderError } from 'commander'

const units: Record<string, number> = {
  s: 1e3,
  m: 6e3,
  h: 36e6,
  d: 8.64e7,
}

/**
 * Timeunit parser
 * @private
 * @param input - Time string
 * @returns     - Value in ms
 */
export const timeunit = (input: string): number => {
  if (!isNaN(parseInt(input, 10))) {
    return parseInt(input, 10)
  }
  const match = /(\d*\.?\d*)(d|s|h|m)/.exec(input)
  if (match !== null && !isNaN(parseFloat(match[1])) && match[2] in units) {
    return parseFloat(match[1]) * units[match[2]]
  }
  throw new CommanderError(1, '', `Failed to parse time: "${input}"!`)
}
