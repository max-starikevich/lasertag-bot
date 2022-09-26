module.exports = {
  roots: ['<rootDir>/src'],
  passWithNoTests: true,
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    "\\$/(.*)": '<rootDir>/src/$1'
  }
}
