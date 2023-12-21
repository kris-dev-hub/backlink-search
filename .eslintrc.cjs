module.exports = {
  env: {
    node: true,
    browser: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended', // Added missing comma here
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  },
  rules: {
    // Add custom rules or override existing ones here
    // Examples:
    // 'vue/no-unused-vars': 'error',
    // '@typescript-eslint/no-explicit-any': 'off',
  }
}
