/**
 * @fileoverview Update script
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * Forked by https://github.com/mysticatea/eslint-plugin-eslint-comments/tree/master/scripts/update.js
 */
import { resolve } from 'path'
import { createIndex } from './lib/utils'

// docs.
import './update-rule-docs'
import './update-docs-index'

// recommended rules.
import './update-legacy-recommended-rules'
import './update-flat-recommended-rules'
import './update-flat-base-config'
import './update-meta'
import { writeAndFormat } from './lib/write'

// indices.
for (const pairs of [
  [resolve(__dirname, '../lib/rules')]
  // [resolve(__dirname, '../lib/utils'), '', true]
] as const) {
  const [dirPath, prefix = undefined, all = undefined] = pairs
  writeAndFormat(`${dirPath}.ts`, createIndex(dirPath, prefix, all))
}
