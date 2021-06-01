# Getting Started

## :cd: Installation

Use [npm](https://www.npmjs.com/) or a compatible tool.

```sh
npm install --save-dev eslint @intlify/eslint-plugin-svelte
```

::: tip Requirements

- ESLint v7.0.0 or later
- Node.js v10.13.0 or later

:::

## :rocket: Usage

Configure your `.eslintrc.*` file.

For example:

```js
module.export = {
  overrides: [
    {
      files: ['*.svelte'],
      extends: [
        // Recommended
        'plugin:@intlify/svelte/recommended'
      ],
      rules: {
        // Optional.
        '@intlify/svelte/no-raw-text': 'error'
        // ...
      }
    }
  ]
}
```

See [the rule list](./rules/README.md)

### Running ESLint from command line

If you want to run `eslint` from command line, make sure you include the `.svelte` extension using [the `--ext` option](https://eslint.org/docs/user-guide/configuring#specifying-file-extensions-to-lint) or a glob pattern because ESLint targets only `.js` files by default.

Examples:

```bash
eslint --ext .js,.svelte src
eslint "src/**/*.{js,svelte}"
```

## :question: FAQ

### What is the "Use the latest svelte-eslint-parser" error?

The most rules of `@intlify/eslint-plugin-svelte` require `svelte-eslint-parser` to check `<template>` ASTs.

Make sure you have one of the following settings in your **.eslintrc**:

- `"extends": ["plugin:@intlify/svelte/recommended"]`
- `"extends": ["plugin:@intlify/svelte/base"]`

<!-- See also: "[Use together with custom parsers](#use-together-with-custom-parsers)" section. -->

### Why doesn't it work on .svelte file?

1. Make sure you don't have `eslint-plugin-svelte3` in your config. The `eslint-plugin-svelte3` extracts the content from `<script>` tags, but `@intlify/eslint-plugin-svelte` requires `<script>` tags and other element tags in order to distinguish template and script in `*.svelte`.

```diff
  "plugins": [
    "@intlify/svelte",
-   "svelte3"
  ]
```

2. Make sure your tool is set to lint `.svelte` files.

- CLI targets only `.js` files by default. You have to specify additional extensions by `--ext` option or glob patterns. E.g. `eslint "src/**/*.{js,svelte}"` or `eslint src --ext .svelte`.
