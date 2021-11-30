/**
 * @fileoverview VuePress configuration
 * @author kazuya kawaguchi (a.k.a. kazupon)
 */
'use strict'

require('ts-node').register()
const { withCategories } = require('../../scripts/lib/rules')
require('../../scripts/update-rule-docs')
require('../../scripts/update-docs-index')

module.exports = {
  configureWebpack(_config, _isServer) {
    return {
      resolve: {
        alias: {
          module: require.resolve('./shim/module')
        }
      }
    }
  },
  base: '/',
  title: '@intlify/eslint-plugin-svelte',
  description: 'ESLint plugin for internationalization with Svelte',
  serviceWorker: true,
  evergreen: true,
  head: [['meta', { name: 'theme-color', content: '#3eaf7c' }]],
  themeConfig: {
    repo: 'intlify/eslint-plugin-svelte',
    docsRepo: 'intlify/eslint-plugin-svelte',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    search: false,
    lastUpdated: true,
    serviceWorker: {
      updatePopup: true
    },
    nav: [
      {
        text: 'Release Notes',
        link: 'https://github.com/intlify/eslint-plugin-svelte/releases'
      }
    ],
    sidebar: {
      '/': [
        '/',
        '/started',
        '/rules/',
        ...withCategories
          .filter(({ rules }) => rules.length)
          .map(({ category, rules }) => ({
            title: `Rules in ${category}`,
            collapsable: false,
            children: rules.map(rule => `/rules/${rule.name}`)
          }))
      ]
    }
  }
}
