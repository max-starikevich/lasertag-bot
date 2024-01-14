module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/test'],
  passWithNoTests: true,
  testMatch: [
    '**/*.e2e-test.ts',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    "\\$/(.*)": '<rootDir>/src/$1'
  }
}
