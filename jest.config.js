/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  passWithNoTests: true,
  testPathIgnorePatterns: ["/node_modules/", "/VERSAO WEB/"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setupAfterEnv.js"],
};