module.exports = {
  ignorePatterns: ['spec/**/*'],
  overrides: [
    {
      files: ['testImage.test.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-console': 'off'
      }
    }
  ]
};
