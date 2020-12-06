module.exports = {
  extends: ['./node_modules/aberlaas/lib/configs/eslint.js'],
  overrides: [
    // Some of the module we expect are loaded from the host
    {
      files: ['src/**/*.js'],
      rules: {
        'node/no-unpublished-require': [
          'error',
          {
            allowModules: ['norska'],
          },
        ],
        'node/no-extraneous-require': [
          'error',
          {
            allowModules: ['lodash-es', 'hogan.js'],
          },
        ],
      },
    },
  ],
};
