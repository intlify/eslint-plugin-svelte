/**
 * @fileoverview Update script
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * Forked by https://github.com/mysticatea/eslint-plugin-eslint-comments/tree/master/scripts/update.js
 */
import { resolve } from 'path'
import { createIndex } from './lib/utils.js'

// docs.
import './update-rule-docs.js'
import './update-docs-index.js'

// recommended rules.
import './update-flat-recommended-rules.js'
import './update-flat-base-config.js'
import './update-meta.js'
import { writeAndFormat } from './lib/write.js'

// indices.
for (const pairs of [[resolve(import.meta.dirname, '../lib/rules')]] as const) {
  const [dirPath, prefix = undefined, all = undefined] = pairs
  writeAndFormat(`${dirPath}.ts`, createIndex(dirPath, prefix, all))
}
