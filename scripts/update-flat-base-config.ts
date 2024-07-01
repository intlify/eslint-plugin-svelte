import { resolve } from 'path'
import { writeAndFormat } from './lib/write'

writeAndFormat(
  //base.ts
  resolve(__dirname, '../lib/configs/flat/base.ts'),
  `/** DON'T EDIT THIS FILE; was created by scripts. */
  export = [
    {
      name: '@intlify/svelte:base:setup',
      plugins: {
        get '@intlify/svelte'() {
          return require('../../index')
        }
      }
    },
    {
      name: '@intlify/svelte:base:svelte',
      files: ['*.svelte'],
      languageOptions: {
          parser: require('svelte-eslint-parser'),
      }
    },
  ]`
)
