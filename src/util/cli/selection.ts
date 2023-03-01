import { CommanderError } from 'commander'

/**
 * Create new selection from options
 * @param options
 * @returns - Selection
 */
export const selection = <T extends string>(options: T[]): ((input: string) => T) => {
  return (input) => {
    if (options.includes(input.toLowerCase() as T)) {
      return input.toLowerCase() as T
    }
    throw new CommanderError(1, '', `Unknown option: "${input}"!`)
  }
}
