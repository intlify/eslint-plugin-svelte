'use strict'

const cp = require('child_process')
const path = require('path')
const assert = require('assert')

const TEST_CWD = path.join(__dirname, 'config-recommended')

describe('Integration with "plugin:@intlify/svelte/recommended"', () => {
  let originalCwd

  before(() => {
    originalCwd = process.cwd()
    process.chdir(TEST_CWD)
    cp.execSync('yarn', { stdio: 'inherit' })
  })
  after(() => {
    process.chdir(originalCwd)
  })

  it('should work with shareable config', () => {
    const CLIEngine = require('./config-recommended/node_modules/eslint')
      .CLIEngine
    const engine = new CLIEngine({
      cwd: TEST_CWD,
      extensions: ['.js', '.svelte', '.json']
    })
    const result = engine.executeOnFiles(['./src'])
    const aSvelte = result.results.find(
      r => path.basename(r.filePath) === 'a.svelte'
    )
    assert.strictEqual(aSvelte.messages.length, 1)
    assert.strictEqual(
      aSvelte.messages[0].ruleId,
      '@intlify/svelte/no-raw-text'
    )
  })
})
