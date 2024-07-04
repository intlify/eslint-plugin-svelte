import cp from 'node:child_process'
import path from 'node:path'
import assert from 'node:assert'
import semver from 'semver'
import { readPackageJson } from './helper'

const TEST_CWD = path.join(__dirname, 'flat-config')
const ESLINT = `.${path.sep}node_modules${path.sep}.bin${path.sep}eslint`

describe('Integration with flat config', () => {
  let originalCwd: string

  before(() => {
    originalCwd = process.cwd()
    process.chdir(TEST_CWD)
    cp.execSync('yarn', { stdio: 'inherit' })
  })
  after(() => {
    originalCwd && process.chdir(originalCwd)
  })

  it('should work with flat config', async () => {
    if (
      !semver.satisfies(
        process.version,
        readPackageJson(
          path.resolve(__dirname, './flat-config/node_modules/eslint')
        ).engines.node
      )
    ) {
      return ``
    }
    const cliResult = cp.execSync(`${ESLINT} src/* --format=json`, {
      encoding: 'utf-8'
    })

    const result = JSON.parse(cliResult)

    const aSvelte = result.results.find(
      (r: { filePath: string }) => path.basename(r.filePath) === 'a.svelte'
    )
    assert.strictEqual(aSvelte.messages.length, 1)
    assert.strictEqual(
      aSvelte.messages[0].ruleId,
      '@intlify/svelte/no-raw-text'
    )
  })
})
