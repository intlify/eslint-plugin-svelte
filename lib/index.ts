/**
 * @fileoverview ESLint plugin for internationalization with Svelte
 * @author Yosuke Ota
 */
import legacyBase from './configs/base'
import legacyRecommended from './configs/recommended'
import flatBase from './configs/flat/base'
import flatRecommended from './configs/flat/recommended'
import rules from './rules'
import * as meta from './meta'

export = {
  meta,
  // eslintrc configs
  configs: {
    base: legacyBase,
    recommended: legacyRecommended,

    // flat configs
    'flat/base': flatBase,
    'flat/recommended': flatRecommended
  },
  rules
}
