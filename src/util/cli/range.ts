import { CommanderError } from 'commander'

export const range = (min = -Infinity, max = Infinity): ((input: string) => number) => {
  return (input) => {
    const result = parseInt(input, 10)
    if (isNaN(result)) {
      throw new CommanderError(0, '', `Invalid number: "${input}"!`)
    }
    if (result < min || result > max) {
      throw new CommanderError(0, '', `Number out of range: "${input}"!`)
    }
    return result
  }
}
