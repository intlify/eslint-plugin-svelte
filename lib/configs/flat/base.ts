/** DON'T EDIT THIS FILE; was created by scripts. */
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
    files: ['**/*.svelte', '*.svelte'],
    languageOptions: {
      parser: parser
    }
  }
]
