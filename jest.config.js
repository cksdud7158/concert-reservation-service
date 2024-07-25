module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "test",
  moduleNameMapper: {
    "^@app/(.*)$": "<rootDir>/../src/$1",
  },
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  maxWorkers: 1,
  setupFilesAfterEnv: ["<rootDir>/mock/config/jest-setup.ts"],
  detectOpenHandles: true,
};
