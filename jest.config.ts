/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  modulePathIgnorePatterns: ['/node_modules/', '/build/'],
  testRegex: '(__tests__/.*\\.)?test\\.(js|ts|tsx)$',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/utils/jest-mocks/async-storage.js'],
};

export default config;
