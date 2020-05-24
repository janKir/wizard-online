module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["jest-localstorage-mock", "jest-date-mock"],
  setupFilesAfterEnv: [`<rootDir>/jest.setup.ts`],
  transformIgnorePatterns: ["/*.mp3/"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.cache/",
    "<rootDir>/dist/",
    "<rootDir>/src/test/skip/",
  ],
};
