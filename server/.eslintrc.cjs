module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    quotes: 'off',
    'space-before-function-paren': 'off',
    'no-undef': 'off', // 不禁用会导致全局interface报错
    'no-unused-vars': 'off'// 不禁用会导致全局interface报错
  }
}
