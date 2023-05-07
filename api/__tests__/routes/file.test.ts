import { describe, test } from "@jest/globals";
import { FileLocation } from "@selab-2/groep-1-orm";
import { AuthenticationLevel, Testrunner } from "../utilities/Testrunner";
import * as fs from "fs";
import path from "path";
import request from "supertest";
import app from "../../src/main";
import {
    deleteDatabaseData,
    initialiseDatabase,
    restoreTables,
} from "../mock/database";
import {
    badRequestResponse,
    forbiddenResponse,
    notFoundResponse,
} from "../utilities/constants";

process.env["LOCAL_FILE_PATH"] = "__tests__/mock/file_server";

describe("File tests", () => {
    let runner: Testrunner;

    beforeAll(async () => {
        const server = request(app);
        runner = new Testrunner(server);

        await deleteDatabaseData();
        await initialiseDatabase();

        runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
    });

    afterEach(async () => {
        await restoreTables();
    });

    describe("Succesful requests", () => {
        test("POST /file EXTERNAL", async () => {
            const newFile = {
                path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                location: "EXTERNAL",
                file: null,
            };

            const expectedFile = {
                path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                location: "EXTERNAL",
            };

            await runner.post({
                url: "/file",
                data: newFile,
                expectedResponse: expectedFile,
            });
        });

        test("POST /file FILE_SERVER", async () => {
            const dirname = path.resolve();
            const full_path = path.join(
                dirname,
                "__tests__/mock/files/test.txt",
            );
            const newFile = {
                path: "__tests__/mock/file_server/test.txt",
                location: "FILE_SERVER",
                sendFile: fs.readFileSync(full_path),
            };

            const expectedFile = {
                path: "__tests__/mock/file_server/test.txt",
                location: "FILE_SERVER",
            };

            await runner.postFile({
                url: "/file",
                path: "__tests__/mock/file_server/test.txt",
                location: "FILE_SERVER",
                file: full_path,
                expectedResponse: expectedFile,
            });
        });

        test("GET /file/:id EXTERNAL", async () => {
            const expected = [
                {
                    id: 6,
                    path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    location: "EXTERNAL",
                },
            ];
            await runner.get({
                url: "/file/6",
                expectedData: expected,
            });
        });

        test("GET /file/:id FILE_SERVER", async () => {
            const expected = [
                {
                    id: 5,
                    path: "__tests__/mock/files/test.txt",
                    location: FileLocation.FILE_SERVER,
                },
            ];

            await runner.get({ url: "/file/5", expectedData: expected });
        });

        test("DELETE /file/:id", async () => {
            await runner.delete({
                url: "/file/7",
            });
        });
    });
    describe("Unsuccessful requests", () => {
        test("POST /file with missing path", async () => {
            const newFile = {
                location: "EXTERNAL",
                file: null,
            };

            await runner.post({
                url: "/file",
                data: newFile,
                statusCode: 400,
                expectedResponse: badRequestResponse,
            });
        });

        test("POST /file with invalid location", async () => {
            const newFile = {
                path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                location: "INVALID",
                file: null,
            };

            await runner.post({
                url: "/file",
                data: newFile,
                statusCode: 400,
                expectedResponse: badRequestResponse,
            });
        });

        test("GET /file/:id with non-existent ID", async () => {
            await runner.get({
                url: "/file/999",
                statusCode: 404,
                expectedData: [notFoundResponse],
            });
        });

        test("GET /file/:id with invalid ID format", async () => {
            await runner.get({
                url: "/file/invalid-id",
                statusCode: 400,
                expectedData: [badRequestResponse],
            });
        });

        test("GET /file/:id with negative ID", async () => {
            await runner.get({
                url: "/file/-1",
                statusCode: 404,
                expectedData: [notFoundResponse],
            });
        });

        test("GET /file/:id with zero ID", async () => {
            await runner.get({
                url: "/file/0",
                statusCode: 404,
                expectedData: [notFoundResponse],
            });
        });

        test("DELETE /file/:id with non-existent ID", async () => {
            await runner.delete({
                url: `/file/999`,
                statusCode: 404,
            });
        });

        test("DELETE /file/:id with invalid ID format", async () => {
            await runner.delete({
                url: "/file/invalid-id",
                statusCode: 400,
            });
        });

        describe("Cannot reach any path without authorisation", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
            });

            test("Cannot reach GET /action/:id", async () => {
                await runner.get({
                    url: "/file/1",
                    expectedData: [forbiddenResponse],
                    statusCode: 403,
                });
            });

            test("Cannot reach POST /file", async () => {
                const newFile = {
                    path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    location: "INVALID",
                    file: null,
                };
                await runner.post({
                    url: "/file",
                    data: newFile,
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
    });

    afterAll(() => {
        app.close();
    });
});
