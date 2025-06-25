const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**/*',
    '!src/app/layout.tsx',
    '!src/app/globals.css',
    '!src/styles/**/*',
    // Exclude files that don't have tests yet
    '!src/app/page.tsx',
    '!src/contexts/ThemeContext.tsx',
    '!src/components/theme_toggle/ThemeToggle.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 55,
      lines: 60,
      statements: 60,
    },
    // Higher thresholds for components that have comprehensive tests
    'src/components/search_bar/**': {
      branches: 90,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/lib/**': {
      branches: 50,
      functions: 80,
      lines: 80,
      statements: 75,
    },
    'src/hooks/**': {
      branches: 70,
      functions: 75,
      lines: 85,
      statements: 85,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig) 