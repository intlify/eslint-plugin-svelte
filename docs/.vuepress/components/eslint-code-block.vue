<template>
  <div class="eslint-code-container">
    <eslint-editor
      ref="editor"
      :linter="linter"
      :config="config"
      v-model="code"
      :style="{ height }"
      class="eslint-code-block"
      :filename="resplvedFilename"
      :language="language"
      dark
      :format="format"
      :fix="fix"
    />
  </div>
</template>

<script>
import './setup'
import EslintEditor from 'vue-eslint-editor'
import { rules } from '../../../'

export default {
  name: 'ESLintCodeBlock',
  components: { EslintEditor },
  props: {
    fix: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Object,
      default() {
        return {}
      }
    },
    filename: {
      type: String
    },
    language: {
      type: String,
      default: 'html'
    },
    localeKey: {
      type: String,
      default: 'file'
    },
    messageSyntaxVersion: {
      type: String,
      default: '^9'
    }
  },

  data() {
    return {
      linter: null,
      format: {
        insertSpaces: true,
        tabSize: 2
      },
      code: '',
      height: null
    }
  },

  computed: {
    resplvedFilename() {
      return this.filename || 'example.svelte'
    },
    config() {
      return {
        globals: {
          console: false,
          // ES2015 globals
          ArrayBuffer: false,
          DataView: false,
          Float32Array: false,
          Float64Array: false,
          Int16Array: false,
          Int32Array: false,
          Int8Array: false,
          Map: false,
          Promise: false,
          Proxy: false,
          Reflect: false,
          Set: false,
          Symbol: false,
          Uint16Array: false,
          Uint32Array: false,
          Uint8Array: false,
          Uint8ClampedArray: false,
          WeakMap: false,
          WeakSet: false,
          // ES2017 globals
          Atomics: false,
          SharedArrayBuffer: false
        },
        rules: this.rules,
        parser: 'svelte-eslint-parser',
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: 'module',
          ecmaFeatures: {
            jsx: true
          }
        }
      }
    }
  },

  methods: {
    computeCodeFromSlot(nodes) {
      if (!Array.isArray(nodes)) {
        return ''
      }
      return nodes
        .map(node => node.text || this.computeCodeFromSlot(node.children))
        .join('')
    },
    lint() {
      this.$refs.editor.lint()
    }
  },

  async mounted() {
    this.code = `${this.computeCodeFromSlot(this.$slots.default).trim()}\n`

    const lines = this.code.split('\n').length
    this.height = `${Math.max(120, 19 * lines)}px`

    // Load linter.
    const [
      { default: Linter },
      { default: coreRules },
      svelteESLintParser
    ] = await Promise.all([
      import('eslint4b/dist/linter'),
      import('eslint4b/dist/core-rules'),
      import('espree').then(() => import('svelte-eslint-parser'))
    ])

    const linter = (this.linter = new Linter({ cwd: '/path' }))

    linter.defineRules(coreRules)
    for (const ruleId of Object.keys(rules)) {
      linter.defineRule(`@intlify/svelte/${ruleId}`, rules[ruleId])
    }
    linter.defineParser('svelte-eslint-parser', svelteESLintParser)
  }
}
</script>

<style>
.eslint-code-container {
  border-radius: 6px;
  padding: 1.25rem 0;
  margin: 1em 0;
  background-color: #1e1e1e;
}

.eslint-code-block {
  width: 100%;
}

.eslint-editor-actions {
  bottom: -0.9rem;
}
</style>
