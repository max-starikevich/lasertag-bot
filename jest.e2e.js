module.exports = {
  roots: ['<rootDir>/test'],
  setupFiles: ["dotenv/config"],
  passWithNoTests: true,
  testMatch: [
    '<rootDir>/**/*.e2e-test.ts',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    "\\$/(.*)": '<rootDir>/src/$1'
  }
}
