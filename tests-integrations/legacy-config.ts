import cp from 'child_process'
import path from 'path'
import assert from 'assert'

const TEST_CWD = path.join(__dirname, 'legacy-config')

describe('Integration with Legacy config', () => {
  let originalCwd: string

  before(() => {
    originalCwd = process.cwd()
    process.chdir(TEST_CWD)
    cp.execSync('yarn', { stdio: 'inherit' })
  })
  after(() => {
    process.chdir(originalCwd)
  })

  it('should work with Legacy config', async () => {
    const ESLint = require('./legacy-config/node_modules/eslint').ESLint

    const engine = new ESLint({
      cwd: TEST_CWD,
      extensions: ['.js', '.svelte', '.json']
    })

    try {
      const results = await engine.lintFiles(['./src'])

      const aSvelte = results.find(
        (r: { filePath: any }) => path.basename(r.filePath) === 'a.svelte'
      )

      if (!aSvelte) {
        throw new Error('a.svelte file not found in lint results')
      }

      assert.strictEqual(aSvelte.messages.length, 1)
      assert.strictEqual(
        aSvelte.messages[0].ruleId,
        '@intlify/svelte/no-raw-text'
      )
    } catch (error) {
      console.error('Error during linting:', error)
      throw error
    }
  })
})
