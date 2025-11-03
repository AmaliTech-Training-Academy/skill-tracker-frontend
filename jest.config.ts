import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
  },
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  rootDir: process.cwd(),
  coverageReporters: ['text', 'text-summary', 'lcov'],
};

module.exports = config;
