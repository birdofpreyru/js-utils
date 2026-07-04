export default {
  collectCoverage: true,
  coverageDirectory: '__coverage__',
  resolver: 'ts-jest-resolver',
  testPathIgnorePatterns: [
    '/__tests__/ts-types/',
  ],
};
