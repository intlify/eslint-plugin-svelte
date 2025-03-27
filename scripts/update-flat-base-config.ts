import { resolve } from 'path'
import { writeAndFormat } from './lib/write.js'

writeAndFormat(
  //base.ts
  resolve(import.meta.dirname, '../lib/configs/flat/base.ts'),
  `/** DON'T EDIT THIS FILE; was created by scripts. */
import parser from 'svelte-eslint-parser'
import plugin from '../../index.js'
export default [
  {
    name: '@intlify/svelte:base:setup',
    plugins: {
      get '@intlify/svelte'() {
        return plugin
      }
    }
  },
  {
    name: '@intlify/svelte:base:svelte',
    files: ['*.svelte'],
    languageOptions: {
        parser: parser,
    }
  },
]`
)
