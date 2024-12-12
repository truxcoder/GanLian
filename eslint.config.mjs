/*
 * @Author: truxcoder
 * @Date: 2024-12-11 14:21:00
 * @LastEditTime: 2024-12-11 15:08:01
 * @LastEditors: truxcoder
 * @Description:
 */
import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'

export default typescriptEslint.config(
  { ignores: ['*.d.ts', '**/coverage', '**/dist'] },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      // ...eslintPluginVue.configs['flat/recommended'],
      ...pluginVue.configs['flat/vue2-recommended'],
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      // your rules
    },
  },
  eslintConfigPrettier,
)
