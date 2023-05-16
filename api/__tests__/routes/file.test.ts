import { describe, expect, test } from "@jest/globals";
import { AuthenticationLevel, Testrunner } from "../utilities/Testrunner";
import request from "supertest";
import app from "../../src/main";
import {
    deleteDatabaseData,
    initialiseDatabase,
    resetDatabase,
    restoreTables,
} from "../mock/database";
import {
    badRequestResponse,
    forbiddenResponse,
    notFoundResponse,
} from "../utilities/constants";
import { opendirSync, unlinkSync } from "fs";
import path from "path";

process.env["FILE_STORAGE_DIRECTORY"] = `${path.resolve()}/__tests__/mock/file_server`;

describe("File tests", () => {
    let runner: Testrunner;

    beforeAll(async () => {
        const server = request(app);
        runner = new Testrunner(server);

        runner.authLevel(AuthenticationLevel.SUPER_STUDENT);

        return resetDatabase();
    });

    afterEach(async () => {
        await restoreTables();
    });

    describe("Succesful requests", () => {
        test("GET /file", async () => {
            const expected = [
                {
                    createdAt: "1969-12-31T23:00:00.000Z",
                    id: 10,
                    location: "FILE_SERVER",
                    mime: "application/pdf",
                    original_name: "handleiding.pdf",
                    path: "manual.pdf",
                    size_in_bytes: 1024,
                    updatedAt: "1969-12-31T23:00:00.000Z",
                    user_id: 1,
                },
                {
                    createdAt: "1969-12-31T23:00:00.000Z",
                    id: 11,
                    location: "FILE_SERVER",
                    mime: "text/plain",
                    original_name: "example.txt",
                    path: "example.txt",
                    size_in_bytes: 13,
                    updatedAt: "1969-12-31T23:00:00.000Z",
                    user_id: 2,
                },
            ];
            await runner.get({ url: "/file", expectedData: expected });
        });

        test("GET /file/:id", async () => {
            const expected = {};
            await runner.get({ url: "/file/11", expectedData: [expected] });
        });

        test("DELETE /file/:id", async () => {
            runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            await runner.delete({
                url: "/file/11",
            });

            const expected = [
                {
                    createdAt: "1969-12-31T23:00:00.000Z",
                    id: 10,
                    location: "FILE_SERVER",
                    mime: "application/pdf",
                    original_name: "handleiding.pdf",
                    path: "manual.pdf",
                    size_in_bytes: 1024,
                    updatedAt: "1969-12-31T23:00:00.000Z",
                    user_id: 1,
                },
            ];

            await runner.get({
                url: "/file?deleted=true",
                expectedData: expected,
            });
        });
    });

    describe("Unsuccesful requests", () => {
        let runner: Testrunner;
        beforeAll(async () => {
            const server = request(app);
            runner = new Testrunner(server);

            await deleteDatabaseData();
            await initialiseDatabase();
        });

        describe("Must be correctly authorized to use any path", () => {
            const newFile = {};

            describe("Cannot reach any path without authorisation", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                });

                test("Cannot reach GET /file", async () => {
                    await runner.get({
                        url: "/file",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach GET /file/:id", async () => {
                    await runner.get({
                        url: "/file/1",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /file", async () => {
                    await runner.postFile({
                        url: "/file",
                        file: "__tests__/mock/file/test2.txt",
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /file/:id", async () => {
                    await runner.delete({
                        url: "/file/1",
                        statusCode: 403,
                    });
                });
            });
            describe("Cannot reach any path as a student", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.STUDENT);
                });

                test("Cannot reach GET /file", async () => {
                    await runner.get({
                        url: "/file",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /file/:id", async () => {
                    await runner.delete({
                        url: "/file/10",
                        statusCode: 403,
                    });
                });
            });
        });
        describe("The requested path must exist", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("Find a nonexistent file", async () => {
                await runner.get({
                    url: "/file/5",
                    expectedData: [notFoundResponse],
                    statusCode: 404,
                });
            });

            test("Update a nonexistent file", async () => {
                await runner.get({
                    url: "/file/5",
                    expectedData: [notFoundResponse],
                    statusCode: 404,
                });
            });
            test("Delete a nonexistent file", async () => {
                await runner.delete({ url: "/file/5", statusCode: 404 });
            });
        });
        describe("The type of file id must be correct", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("GET request", async () => {
                await runner.get({
                    url: "/file/wrongtype",
                    expectedData: [badRequestResponse],
                    statusCode: 400,
                });
            });

            test("DELETE request", async () => {
                await runner.delete({
                    url: "/file/wrongtype",
                    statusCode: 400,
                });
            });
        });

        test("PATCH request has to be allowed", async () => {
            runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            const updateFile = {
                path: "newPath",
            };
            await runner.patch({
                url: "/file/10",
                data: updateFile,
                expectedResponse: forbiddenResponse,
                statusCode: 403,
            });
        });
    });

    afterAll(() => {
        app.close();

        //delete added files
        const dir = opendirSync(`${process.env.FILE_STORAGE_DIRECTORY}`);
        let dirent;
        while ((dirent = dir.readSync()) !== null) {
            if (dirent.name != "INIT.txt") {
                unlinkSync(
                    `${process.env.FILE_STORAGE_DIRECTORY}/${
                        dirent.name
                    }`,
                );
            }
        }
        dir.closeSync();
    });
});
