import path from 'path'
import packageJson from '../package.json' with { type: 'json' }
import { getNewVersion } from './lib/changesets-util.js'
import { writeAndFormat } from './lib/write.js'

const { name, version } = packageJson

const META_PATH = path.join(import.meta.dirname, '../lib/meta.ts')

void main()

/** main */
async function main() {
  await writeAndFormat(
    META_PATH,
    `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "pnpm run update"
 */
export const name = ${JSON.stringify(name)} as const;
export const version = ${JSON.stringify(await getVersion())} as const;
`
  )
}

/** Get version */
function getVersion() {
  // eslint-disable-next-line no-process-env -- ignore
  if (process.env.IN_VERSION_CI_SCRIPT) {
    return getNewVersion()
  }
  return version
}
