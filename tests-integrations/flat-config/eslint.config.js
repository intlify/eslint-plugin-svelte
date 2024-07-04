import intlifySvelte from '@intlify/eslint-plugin-svelte'

export default [
  ...intlifySvelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    rules: {
      '@intlify/svelte/no-raw-text': 'error'
    }
  }
]
