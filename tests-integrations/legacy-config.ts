import cp from 'child_process'
import path from 'path'
import assert from 'assert'
import semver from 'semver'
import { readPackageJson } from './helper'

const TEST_CWD = path.join(__dirname, 'legacy-config')
const ESLINT = `.${path.sep}node_modules${path.sep}.bin${path.sep}eslint`

describe('Integration with Legacy config', () => {
  let originalCwd: string

  before(() => {
    originalCwd = process.cwd()
    process.chdir(TEST_CWD)
    cp.execSync('yarn', { stdio: 'inherit' })
  })
  after(() => {
    originalCwd && process.chdir(originalCwd)
  })

  it('should work with legacy config', async () => {
    if (
      !semver.satisfies(
        process.version,
        readPackageJson(
          path.resolve(__dirname, './legacy-config/node_modules/eslint')
        ).engines.node
      )
    ) {
      return
    }
    const cliResult = cp.execSync(`${ESLINT} src/* --ext .js,.ts,.svelte --format=json`, {
      encoding: 'utf-8',
      env: { ...process.env,  ESLINT_USE_FLAT_CONFIG: 'false' }
    })
    const result = JSON.parse(cliResult)
    const aSvelte = result.find(
      (r: { filePath: string }) => path.basename(r.filePath) === 'a.svelte'
    )
    assert.strictEqual(aSvelte.messages.length, 1)
    assert.strictEqual(
      aSvelte.messages[0].ruleId,
      '@intlify/svelte/no-raw-text'
    )
  })
})