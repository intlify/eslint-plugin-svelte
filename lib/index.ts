/**
 * @fileoverview ESLint plugin for internationalization with Svelte
 * @author Yosuke Ota
 */
import flatBase from './configs/flat/base.js'
import flatRecommended from './configs/flat/recommended.js'
import rules from './rules.js'
import * as meta from './meta.js'

export const configs = {
  // flat configs
  base: flatBase,
  recommended: flatRecommended,

  // Backward compatibility
  'flat/base': flatBase,
  'flat/recommended': flatRecommended
}
export { meta, rules }
export default { configs, meta, rules }
