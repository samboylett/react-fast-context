module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: ["./src/**/*"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "stories",
  ],
  coverageReporters: ["lcov"],
};
