module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/test"],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/index.ts",
    "!<rootDir>/src/**/*protocols.ts",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "node",
  coverageDirectory: "<rootDir>/coverage",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};
