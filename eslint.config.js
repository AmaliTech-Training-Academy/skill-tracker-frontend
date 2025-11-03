// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    ignores: ['**/*.spec.ts', 'jest.config.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
      prettier,
    ],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.app.json',
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      complexity: 'off',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      'max-classes-per-file': ['error', 1],
      eqeqeq: ['error', 'always'],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none',
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          ignoredMethodNames: [
            'ngOnInit',
            'ngOnDestroy',
            'ngAfterViewInit',
            'ngAfterContentInit',
            'ngAfterViewChecked',
            'ngAfterContentChecked',
            'ngOnChanges',
            'ngDoCheck',
          ],
          overrides: {
            constructors: 'no-public',
          },
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeLike',
          format: ['PascalCase'],
          custom: {
            regex: '(My|my)(?=[A-Z]\\w*)',
            match: false,
          },
        },
        {
          selector: 'enumMember',
          format: ['PascalCase', 'UPPER_CASE'],
        },
        {
          selector: ['parameter'],
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: ['variable', 'function', 'method', 'classProperty', 'typeProperty'],
          format: ['camelCase', 'snake_case'],
          custom: {
            regex: '(My|my)(?=[A-Z]\\w*)',
            match: false,
          },
        },
        {
          selector: ['variable'],
          format: ['UPPER_CASE', 'camelCase'],
          modifiers: ['global'],
          custom: {
            regex: '(My|my)(?=[A-Z]\\w*)',
            match: false,
          },
        },
        {
          selector: ['variable'],
          types: ['function'],
          format: ['camelCase'],
        },
        {
          selector: 'variable',
          modifiers: ['const'],
          types: ['boolean', 'string', 'number', 'array'],
          format: ['UPPER_CASE', 'camelCase'],
        },
        {
          selector: 'interface',
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
          format: ['PascalCase'],
        },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
  {
    files: ['jest.config.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    rules: {},
  },
);
