import { Command } from 'commander'

import { createHash } from 'crypto'
import { timeunit } from './util/cli'
import { isMain } from './util/main'

export interface WatchURLOptions {
  bell: boolean
  interval: number
  quiet: boolean
}

/** Current directory */
const cwd = process.cwd()

/** Cached checksum */
let cache: string | null = null

/**
 * Fetch text from url
 * @param url - Page url
 * @returns   - Page text
 */
const fetchText = async (url: URL): Promise<string> => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`[${res.status}] ${res.statusText} "${res.url}"`)
  }
  return await res.text()
}

/**
 * Compute checksum
 * @param input - text
 * @returns     - hash
 */
const checksum = (input: string): string => {
  return createHash('sha256').update(input, 'binary').digest('base64')
}

/**
 * Run watcher
 * @param url
 * @param opts
 */
const run = (url: URL, opts: Partial<WatchURLOptions>): void => {
  fetchText(url)
    .then((text) => {
      const sum = checksum(text)
      if (cache !== sum) {
        cache = sum
        if (opts.quiet !== true) {
          const bell = opts.bell === true ? '\u0007' : ''
          const date = new Date().toLocaleString()
          console.log(`Update! ${date} - "${sum}"${bell}`)
        }
      }
      setTimeout(() => {
        run(url, opts)
      }, opts.interval)
    })
    .catch((err) => {
      if (err instanceof Error) {
        console.error(`Error: ${err.message}`)
      }
    })
}

// Main
if (isMain()) {
  const app = new Command('watchurl')
  app
    .argument('<url>')
    .option('-q, --quiet', 'disable output')
    .option('-b, --bell', 'enable terminal bell')
    .option('-i, --interval <time>', 'scan interval', timeunit)
    .action((url, opts) => {
      run(new URL(url), {
        interval: 10e3,
        quiet: false,
        ...opts,
      })
    })
    .parse()
}
