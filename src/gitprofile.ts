import { Command } from 'commander'

import { isMain } from './util/main'
import { selection } from './util/cli/selection'

export type GitProfileType = 'group' | 'user'
export type GitProfileAPIs = 'github' | 'gitlab'
export type GitProfileFormats = 'ssh' | 'web' | 'https' | 'zip'

/** Command-line options */
export interface GitProfileOptions {
  api: GitProfileAPIs
  format: GitProfileFormats
  group: boolean
}

/** Supported APIs */
const GIT_PROFILE_APIS: GitProfileAPIs[] = ['github', 'gitlab']

/** Supported url formats */
const GIT_PROFILE_FORMATS: GitProfileFormats[] = ['https', 'ssh', 'web', 'zip']

/**
 * Assert property exists inside response
 * @param obj  - Repo
 * @param prop - Prop name
 * @returns    - Prop value
 */
export const assertProp = <T = string>(obj: any, prop: string): T => {
  const result = obj[prop]
  if (typeof result === 'undefined') {
    throw new Error(`Failed to find response property: "${prop}"!`)
  }
  return result
}

/** API repo properties */
export const props: Record<GitProfileAPIs, Record<GitProfileFormats, (r: any) => string>> = {
  github: {
    ssh: (r) => assertProp(r, 'ssh_url'),
    https: (r) => assertProp(r, 'svn_url'),
    web: (r) => assertProp(r, 'html_url'),
    zip: (r) => {
      const branch = assertProp(r, 'default_branch')
      return `${assertProp(r, 'svn_url')}/archive/refs/heads/${branch}.zip`
    },
  },
  gitlab: {
    ssh: (r) => assertProp(r, 'ssh_url_to_repo'),
    https: (r) => assertProp(r, 'http_url_to_repo'),
    web: (r) => assertProp(r, 'web_url'),
    zip: (r) => {
      const branch = assertProp(r, 'default_branch')
      const name = assertProp(r, 'name')
      return `${assertProp(r, 'web_url')}/-/archive/${branch}/${name}-${branch}.zip`
    },
  },
}

/** API repos routes */
export const routes: Record<GitProfileAPIs, Record<GitProfileType, (name: string) => string>> = {
  github: {
    group: (name) => `https://api.github.com/users/${name}/repos`,
    user: (name) => `https://api.github.com/users/${name}/repos`,
  },
  gitlab: {
    group: (name) => `https://gitlab.com/api/v4/groups/${name}/projects`,
    user: (name) => `https://gitlab.com/api/v4/users/${name}/projects`,
  },
}

/**
 * Run scraper
 * @param names - Profile names
 * @param opts  - Command-line options
 */
export const run = async (names: string[], opts: Partial<GitProfileOptions>): Promise<void> => {
  const projects = routes[opts.api ?? 'github'][opts.group === true ? 'group' : 'user']
  const log = props[opts.api ?? 'github'][opts.format ?? 'https']
  await Promise.all(
    names.map(async (name) => {
      try {
        const res = await fetch(projects(name))
        if (!res.ok) {
          throw new Error(`[${res.status}] ${res.statusText} "${res.url}"`)
        }
        console.log((await res.json()).map((r: any) => log(r)).join('\n'))
      } catch (err) {
        if (err instanceof Error) {
          console.error(`Error: ${err.message}`)
        }
      }
    }),
  )
}

// Main
if (isMain()) {
  const app = new Command('gitprofile')
  app
    .argument('<names...>', 'Profile names')
    .description('Fetch all public packages from a git user.')
    .option(
      '-a, --api <service>',
      `api service ⎯ (${GIT_PROFILE_APIS.join('|')})`,
      selection(GIT_PROFILE_APIS),
    )
    .option(
      '-f, --format <type>',
      `url format  ⎯ (${GIT_PROFILE_FORMATS.join('|')})`,
      selection(GIT_PROFILE_FORMATS),
    )
    .option('-g, --group', 'find group repos')
    .version('0.1.1', '-v, --version')
    .action(run)
    .parse(process.argv)
}
