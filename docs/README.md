# Introduction

@intlify/eslint-plugin-svelte is ESLint plugin for internationalization with Svelte. It easily integrates some localization features to your Svelte Application.

Go to [Get Started](./started.md)

<eslint-code-block :rules="{ '@intlify/svelte/no-raw-text': 'error' }">

<!-- eslint-skip -->

```html
<!-- ✓ GOOD -->
<h2>{$_('page.subtitle')}</h2>

<!-- ✗ BAD -->
<p>Plain text cannot be replaced by multiple languages.</p>
```

</eslint-code-block>
