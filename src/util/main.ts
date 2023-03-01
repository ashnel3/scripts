/**
 * Check if script is main file
 * @returns - Is main file
 */
export const isMain = (): boolean => {
  return process.argv[1] === __filename
}
