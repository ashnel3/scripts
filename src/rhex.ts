import { Command } from 'commander'

import { randomBytes } from 'crypto'
import { isMain } from './util/main'
import { selection, range } from './util/cli'

export interface RandomHexOptions {
  format: BufferEncoding
  length: number
}

/** Supported encodings */
const RHEX_ENCODINGS: BufferEncoding[] = [
  'ascii',
  'utf8',
  'utf-8',
  'utf16le',
  'ucs2',
  'ucs-2',
  'base64',
  'base64url',
  'latin1',
  'binary',
  'hex',
]

/** Maximum length */
const RHEX_MAX_LENGTH = !isNaN(parseInt(process.env.RHEX_MAX_LENGTH as string, 10))
  ? parseInt(process.env.RHEX_MAX_LENGTH as string, 10)
  : 4096

/**
 * Generate random hex
 * @param opts - Command-line options
 */
export const run = (len: number, opts: Partial<RandomHexOptions>): void => {
  console.log(randomBytes(len).toString(opts.format ?? 'hex'))
}

if (isMain()) {
  const app = new Command('rhex')
  app
    .addHelpText('before', `Supported encodings: ${RHEX_ENCODINGS.join('|')}`)
    .argument('[bytes]', 'buffer size')
    .option('-f, --format <encoding>', 'string encoding', selection(RHEX_ENCODINGS))
    .action((length, opts) => {
      run(range(0, RHEX_MAX_LENGTH)(length ?? '8'), opts)
    })
    .parse()
}
