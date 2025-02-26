/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  openHandlesTimeout: 10 * 1000,
  testTimeout: 10 * 1000
};

