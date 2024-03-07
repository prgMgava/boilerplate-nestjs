module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'perfectionist'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'require-await': 'off',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    'no-restricted-syntax': [
      'error',
      {
        selector:
          'CallExpression[callee.object.name=configService][callee.property.name=/^(get|getOrThrow)$/]:not(:has([arguments.1] Property[key.name=infer][value.value=true])), CallExpression[callee.object.property.name=configService][callee.property.name=/^(get|getOrThrow)$/]:not(:has([arguments.1] Property[key.name=infer][value.value=true]))',
        message:
          'Add "{ infer: true }" to configService.get() for correct typechecking. Example: configService.get("database.port", { infer: true })',
      },
    ],
    'perfectionist/sort-interfaces': 'error',
    'perfectionist/sort-classes': [
      'error',
      {
        type: 'alphabetical',
        order: 'asc',
        groups: [
          'index-signature',
          'static-property',
          'private-property',
          'property',
          'constructor',
          'static-method',
          'private-method',
          'decorated-method',
          'method',
          ['get-method', 'set-method'],
        ],
      },
    ],
    'perfectionist/sort-enums': [
      'error',
      {
        type: 'alphabetical',
        order: 'asc',
      },
    ],
    'perfectionist/sort-named-imports': [
      'error',
      {
        type: 'alphabetical',
        order: 'asc',
      },
    ],
    'perfectionist/sort-imports': [
      'error',
      {
        type: 'alphabetical',
        order: 'asc',
        groups: [
          'nestjs',
          'builtin',
          'external',
          'internal-type',
          'internal',
          'services',
          'api',
          ['parent-type', 'sibling-type', 'index-type'],
          ['parent', 'sibling', 'index'],
          'side-effect',
          'style',
          'object',
          'unknown',
        ],
        'custom-groups': {
          value: {
            nestjs: '@nestjs**/**',
            api: [
              '@auth*/**',
              '@files/**',
              '@home/**',
              '@roles/**',
              '@session/**',
              '@social/**',
              '@statuses/**',
              '@users/**',
            ],
            services: ['@mail**/**'],
          },
          type: {
            api: 'api',
          },
        },
        'newlines-between': 'always',
        'internal-pattern': [
          '@config/**',
          '@logger/**',
          '@middlewares/**',
          '@i18n/**',
          '@database/**',
        ],
      },
    ],
    'perfectionist/sort-objects': [
      'error',
      {
        type: 'alphabetical',
        order: 'asc',
        'partition-by-comment': 'Part:**',
        groups: ['id', 'unknown'],
        'custom-groups': {
          id: 'id',
        },
      },
    ],
  },
};
