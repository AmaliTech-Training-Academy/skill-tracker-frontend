// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
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
      'max-classes-per-file': ['error', 1],
      eqeqeq: ['error', 'always'],
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
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
          selector: ['enumMember', 'typeLike'],
          format: ['PascalCase'],
          custom: {
            regex: '(My|my)(?=[A-Z]\\w*)',
            match: false,
          },
        },
        {
          selector: ['parameter'],
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: ['variable', 'function', 'method', 'classProperty', 'typeProperty'],
          format: ['camelCase'],
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
          selector: 'interface',
          custom: {
            regex: '[Ii](?=[A-Z]\\w*)',
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
);
