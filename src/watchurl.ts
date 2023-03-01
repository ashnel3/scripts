import { Command } from 'commander'

import { execa } from 'execa'
import { createHash } from 'crypto'
import { timeunit } from './util/cli'
import { isMain } from './util/main'

export interface WatchURLOptions {
  exec: string
  bell: boolean
  interval: number
  quiet: boolean
}

/** Current directory */
const cwd = process.cwd()

/** Cached checksum */
let cache: string | null = null

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
  fetch(url)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`[${res.status}] ${res.statusText} "${res.url}"`)
      }
      return await res.text()
    })
    // Checksum text
    .then((text) => {
      const sum = checksum(text)
      if (cache !== sum) {
        cache = sum
        if (opts.quiet !== true) {
          const bell = opts.bell === true ? '\u0007' : ''
          const date = new Date().toLocaleString()
          console.log(`Update! ${date} - "${sum}"${bell}`)
        }
        if (typeof opts.exec === 'string') {
          const [command, ...args] = opts.exec.split(' ')
          execa(command, args, { cwd }).stdout?.pipe(process.stdout)
        }
      }
    })
    // Schedule next check
    .then(() => {
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
    .option('-x, --exec <command>', 'run command')
    .action((url, opts) => {
      run(new URL(url), {
        interval: 10e3,
        quiet: false,
        ...opts,
      })
    })
    .parse()
}
