/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["<rootDir>/__tests__/**/*.ts"],
    setupFilesAfterEnv: ["jest-expect-message"],
};
