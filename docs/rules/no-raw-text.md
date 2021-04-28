---
title: '@intlify/svelte/no-raw-text'
description: disallow to string literal in template
---

# @intlify/svelte/no-raw-text

> disallow to string literal in template

- :star: The `"extends": "plugin:@intlify/svelte/recommended"` property in a configuration file enables this rule.

This rule warns the usage of string literal.

This rule encourage i18n in about the application needs to be localized.

## :book: Rule Details

:-1: Examples of **incorrect** code for this rule:

<eslint-code-block>

<!-- eslint-skip -->

```html
<script>
  /* eslint @intlify/svelte/no-raw-text: 'error' */
</script>
<!-- ✗ BAD -->
<p>hello</p>
```

</eslint-code-block>

:+1: Examples of **correct** code for this rule:

<eslint-code-block>

<!-- eslint-skip -->

```html
<script>
  /* eslint @intlify/svelte/no-raw-text: 'error' */
</script>
<!-- ✓ GOOD -->
<p>{ $_('hello') }</p>
```

</eslint-code-block>

## :gear: Options

```json
{
  "@intlify/svelte/no-raw-text": [
    "error",
    {
      "ignoreNodes": ["md-icon", "v-icon"],
      "ignorePattern": "^[-#:()&]+$",
      "ignoreText": ["EUR", "HKD", "USD"]
    }
  ]
}
```

- `ignoreNodes`: specify nodes to ignore such as icon components
- `ignorePattern`: specify a regexp pattern that matches strings to ignore
- `ignoreText`: specify an array of strings to ignore

## :mag: Implementation

- [Rule source](https://github.com/intlify/eslint-plugin-svelte/blob/main/lib/rules/no-raw-text.ts)
- [Test source](https://github.com/intlify/eslint-plugin-svelte/tree/main/tests/lib/rules/no-raw-text.ts)
