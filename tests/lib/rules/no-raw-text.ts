/**
 * @author Yosuke Ota
 */
import { RuleTester } from 'eslint'
import rule = require('../../../lib/rules/no-raw-text')

const tester = new RuleTester({
  parser: require.resolve('svelte-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  }
})

tester.run('no-raw-text', rule as never, {
  valid: [
    {
      code: `
      <div class="app">
        <p class="a1">{ $_('hello') }</p>
        <p class="inner">{ $_('click') }<a href="/foo">{ $_('here') }</a>{ $_('terminal') }</p>
      </div>
      `
    },
    {
      code: `
      <comp value="{1}" msg="{$_('foo.bar')}"/>
      <p>{ hello }</p>
      `
    },
    {
      code: `
      <md-icon>person</md-icon>
      <v-icon>menu</v-icon>
      `,
      options: [{ ignoreNodes: ['md-icon', 'v-icon'] }]
    },
    {
      code: `
      <p>{ $_('foo') }: { $_('bar') }</p>
      `,
      options: [{ ignorePattern: '^[-.#:()&]+$' }]
    },
    {
      code: `
      <p>hello</p>
      <p>world</p>
      `,
      options: [{ ignoreText: ['hello', 'world'] }]
    }
  ],

  invalid: [
    {
      // simple template
      code: `<p>hello</p>`,
      errors: [
        {
          message: `raw text 'hello' is used`,
          line: 1
        }
      ]
    },
    {
      // included newline or tab or space in simple template
      code: `
      <p>hello</p>
      `,
      errors: [
        {
          message: `raw text 'hello' is used`,
          line: 2
        }
      ]
    },
    {
      // child elements in template
      code: `
      <div class="app">
        <p class="a1">hello</p>
        <p class="inner">click<a href="/foo">here</a>!</p>
      </div>
      `,
      errors: [
        {
          message: `raw text 'hello' is used`,
          line: 3
        },
        {
          message: `raw text 'click' is used`,
          line: 4
        },
        {
          message: `raw text 'here' is used`,
          line: 4
        },
        {
          message: `raw text '!' is used`,
          line: 4
        }
      ]
    },
    {
      // directly specify string literal in mustache
      code: `
      <p>{ 'hello' }</p>
      `,
      errors: [
        {
          message: `raw text 'hello' is used`,
          line: 2
        }
      ]
    },
    {
      // javascript expression specify string literal in mustache
      code: `
      <p>{ ok ? 'hello' : 'world' }</p>
      `,
      errors: [
        {
          message: `raw text 'hello' is used`,
          line: 2
        },
        {
          message: `raw text 'world' is used`,
          line: 2
        }
      ]
    },
    {
      code: `
      <md-icon>person</md-icon>
      <v-icon>menu</v-icon>
      <p>hello</p>
      `,
      options: [{ ignoreNodes: ['md-icon', 'v-icon'] }],
      errors: [
        {
          message: `raw text 'hello' is used`,
          line: 4
        }
      ]
    },
    {
      code: `
      <p>{ $_('foo') }: { $_('bar') }</p>
      <p>hello</p>
      <p> - </p>
      <p>@</p>
      <p>{ true ? $_('ok') : ' - ' }</p>
      <p>{ true ? $_('ok') : '@' }</p>
      `,
      options: [{ ignorePattern: '^[-.#:()&]+$' }],
      errors: [
        {
          message: `raw text 'hello' is used`,
          line: 3
        },
        {
          message: `raw text '@' is used`,
          line: 5,
          column: 10
        },
        {
          message: `raw text '@' is used`,
          line: 7,
          column: 30
        }
      ]
    },
    {
      code: `
      <p>hello</p>
      <p>world</p>
      `,
      options: [{ ignoreText: ['hello'] }],
      errors: [
        {
          message: `raw text 'world' is used`,
          line: 3
        }
      ]
    }
  ]
})
