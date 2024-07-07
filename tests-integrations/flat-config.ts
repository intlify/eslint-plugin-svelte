import cp from 'child_process'
import path from 'path'
import assert from 'assert'

const TEST_CWD = path.join(__dirname, 'flat-config')
const ESLINT = `.${path.sep}node_modules${path.sep}.bin${path.sep}eslint`

describe('Integration with flat config', () => {
  let originalCwd: string

  before(() => {
    originalCwd = process.cwd();
    process.chdir(TEST_CWD);
    try {
      cp.execSync('yarn', { stdio: 'inherit' });
    } catch (error) {
      console.error('Error running yarn:', error);
      throw error;
    }
  });
  after(() => {
    originalCwd && process.chdir(originalCwd)
  })

  it('should work with flat config', async () => {
    const cliResult = cp.execSync(`${ESLINT} src/* --format=json`, {
      encoding: 'utf-8'
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