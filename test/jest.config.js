const { resolve } = require("path");
const root = resolve(__dirname);
module.exports = {
  rootDir: root,
  displayName: "end2end-tests",
  testMatch: ["<rootDir>/**/*.spec.ts"],
  testEnvironment: "node",
  clearMocks: true,
  transform: {
    "^.+.(t|j)s$": "ts-jest",
  },
};
