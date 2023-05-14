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

process.env["FILE_STORAGE_DIRECTORY"] = "__tests__/mock/file_server";

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

        test("POST /file EXTERNAL", async () => {

            const expected = {}
            await runner.postFile({
                url: "/file",
                file: "__tests__/mock/file/test2.txt",
                expectedResponse: expected,
            });
        });




        test("GET /file", async () => {
            const expected = [{"createdAt": "1969-12-31T23:00:00.000Z", "id": 10, "location": "FILE_SERVER", "mime": "application/pdf", "original_name": "handleiding.pdf", "path": "manual.pdf", "size_in_bytes": 1024, "updatedAt": "1969-12-31T23:00:00.000Z", "user_id": 1}];
            await runner.get({ url: "/file", expectedData: expected });
        });

        //     test("get /file:id", async () => {
    //         const expected = {"createdAt": "1969-12-31T23:00:00.000Z", "id": 1, "location": "FILE_SERVER", "mime": "application/pdf", "original_name": "handleiding.pdf", "path": "manual.pdf", "size_in_bytes": 1024, "updatedAt": "1969-12-31T23:00:00.000Z", "user_id": 1};
    //         await runner.get({ url: "/file/1", expectedData: [expected] });
    //     });
    });


    afterAll(() => {
        app.close();
    });
});
