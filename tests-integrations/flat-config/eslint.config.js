import intlifySvelte from '@intlify/eslint-plugin-svelte'
import svelteParser from 'svelte-eslint-parser'

export default [
  ...intlifySvelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte', '*.svelte'],
    languageOptions: {
      parser: svelteParser
    },
    rules: {
      '@intlify/svelte/no-raw-text': 'error'
    }
  }
]
