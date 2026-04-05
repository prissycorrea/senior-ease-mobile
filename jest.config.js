/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  passWithNoTests: true,
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setupAfterEnv.js"],
};