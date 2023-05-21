import { describe, test } from "@jest/globals";
import { AuthenticationLevel, Testrunner } from "../utilities/Testrunner";
import request from "supertest";
import app from "../../src/main";
import { resetDatabase } from "../mock/database";
import {
    badRequestResponse,
    forbiddenResponse,
    notFoundResponse,
} from "../utilities/constants";
import path from "path";
import * as fse from "fs-extra";

process.env[
    "FILE_STORAGE_DIRECTORY"
] = `${path.resolve()}/__tests__/file_server`;

const resetFileServer = () => {
    fse.emptyDirSync(`${path.resolve()}/__tests__/file_server`);
    // copy the initial setting into the folder
    const source = `${path.resolve()}/__tests__/mock/file_server`;
    const dest = `${path.resolve()}/__tests__/file_server`;
    try {
        fse.copySync(source, dest, { overwrite: true });
    } catch (e) {
        console.log(e);
    }
};

describe("File tests", () => {
    let runner: Testrunner;

    beforeAll(async () => {
        const server = request(app);
        runner = new Testrunner(server);

        runner.authLevel(AuthenticationLevel.SUPER_STUDENT);

        resetFileServer();
        return resetDatabase();
    });

    afterEach(async () => {
        resetFileServer();
        await resetDatabase();
    });

    describe("Succesful requests", () => {
        test("POST /file", async () => {
            const expected = {
                mime: "text/plain",
                original_name: "test2.txt",
                size_in_bytes: 13,
                user_id: 2,
            };

            await runner.postFile({
                url: "/file",
                file: `${path.resolve()}/__tests__/mock/upload_files/test2.txt`,
                expectedResponse: expected,
            });
        });

        test("GET /file", async () => {
            const expected = [
                {
                    createdAt: "1970-01-01T00:00:00.000Z",
                    id: 1,
                    mime: "application/pdf",
                    original_name: "handleiding.pdf",
                    path: "manual.pdf",
                    size_in_bytes: 1024,
                    updatedAt: "1970-01-01T00:00:00.000Z",
                    user_id: 1,
                },
                {
                    createdAt: "1970-01-01T00:00:00.000Z",
                    id: 2,
                    mime: "text/plain",
                    original_name: "example.txt",
                    path: "example.txt",
                    size_in_bytes: 13,
                    updatedAt: "1970-01-01T00:00:00.000Z",
                    user_id: 2,
                },
                {
                    createdAt: "1970-01-01T00:00:00.000Z",
                    id: 3,
                    mime: "application/jpeg",
                    original_name: "camera.jpg",
                    path: "camera.jpg",
                    size_in_bytes: 1024,
                    updatedAt: "1970-01-01T00:00:00.000Z",
                    user_id: 1,
                },
            ];
            await runner.get({ url: "/file", expectedData: expected });
        });

        test("GET /file/:id", async () => {
            const expected = "Hello world!\n";
            const response = await runner.getFile({
                url: "/file/2",
                expectedContents: expected,
            });
        });

        test("DELETE /file/:id", async () => {
            runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            await runner.delete({
                url: "/file/1",
            });

            const expected = [
                {
                    createdAt: "1970-01-01T00:00:00.000Z",
                    id: 2,
                    mime: "text/plain",
                    original_name: "example.txt",
                    path: "example.txt",
                    size_in_bytes: 13,
                    updatedAt: "1970-01-01T00:00:00.000Z",
                    user_id: 2,
                },
                {
                    createdAt: "1970-01-01T00:00:00.000Z",
                    id: 3,
                    mime: "application/jpeg",
                    original_name: "camera.jpg",
                    path: "camera.jpg",
                    size_in_bytes: 1024,
                    updatedAt: "1970-01-01T00:00:00.000Z",
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
        describe("Must be correctly authorized to use any path", () => {
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

        test("PATCH  /file not allowed", async () => {
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
        // const dir = opendirSync(`${process.env.FILE_STORAGE_DIRECTORY}`);
        // let dirent;
        // while ((dirent = dir.readSync()) !== null) {
        //     if (dirent.name != "INIT.txt") {
        //         unlinkSync(
        //             `${process.env.FILE_STORAGE_DIRECTORY}/${dirent.name}`,
        //         );
        //     }
        // }
        // dir.closeSync();
    });
});
