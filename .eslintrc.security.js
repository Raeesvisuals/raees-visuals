module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended'
  ],
  rules: {
    // Security-focused rules
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-alert': 'warn',
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'no-global-assign': 'error',
    'no-implicit-globals': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': 'error',
    'no-unsafe-optional-chaining': 'error',
    'no-unused-expressions': 'error',
    'no-useless-concat': 'error',
    'no-useless-escape': 'error',
    'no-void': 'error',
    'no-with': 'error',
    'prefer-promise-reject-errors': 'error',
    'radix': 'error',
    'require-await': 'error',
    'valid-typeof': 'error',
    'yoda': 'error',
    // React security rules
    'react/no-danger': 'error',
    'react/no-danger-with-children': 'error',
    'react/no-unsafe': 'error',
    'react/jsx-no-script-url': 'error',
    'react/jsx-no-target-blank': 'error',
    // Additional security rules
    'prefer-const': 'error',
    'no-var': 'error'
  },
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
};
