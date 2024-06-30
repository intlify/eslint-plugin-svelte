/** DON'T EDIT THIS FILE; was created by scripts. */
export = [
  {
    name: '@intlify/vue-i18n:base:setup',
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
      parser: require('svelte-eslint-parser')
    }
  }
]
