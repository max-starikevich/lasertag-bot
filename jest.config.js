module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/test'],
  passWithNoTests: true,
  testMatch: [
    '**/*.test.ts',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    "\\$/(.*)": '<rootDir>/src/$1'
  }
}
