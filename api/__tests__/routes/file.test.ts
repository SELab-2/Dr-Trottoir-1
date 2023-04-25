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

describe("Action tests", () => {
    let runner: Testrunner;

    beforeAll(async () => {
        const server = request(app);
        runner = new Testrunner(server);

        await deleteDatabaseData();
        await initialiseDatabase();

        runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
    });

    afterEach(async () => {
        await restoreTables("action", "garbage");
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
            const full_path = path.join(dirname, "__tests__/files/test.txt");
            const newFile = {
                path: "__tests__/files/test.txt",
                location: "FILE_SERVER",
                file: fs.readFileSync(full_path),
            };

            const expectedFile = {
                path: "__tests__/files/test.txt",
                location: "FILE_SERVER",
            };

            await runner.post({
                url: "/file",
                data: newFile,
                expectedResponse: expectedFile,
            });
        });

        test("GET /file/:id EXTERNAL", async () => {
            //TODO: 5 aanpassen
            const expected = [
                {
                    id: 5,
                    path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    location: "EXTERNAL",
                },
            ];
            await runner.get({
                url: "/file/5",
                expectedData: expected,
            });
        });

        test("GET /file/:id FILE_SERVER", async () => {
            //TODO: 6 aanpassen
            const expected = [
                {
                    id: 6,
                    path: "__tests__/files/test.txt",
                    location: FileLocation.FILE_SERVER,
                },
            ];

            await runner.get({ url: "/file/6", expectedData: expected });
        });
    });

    afterAll(() => {
        app.close();
    });
});

// import app from "../../src/main";
// import request from "supertest";
// import supertest from "supertest";
// import { describe, expect, test } from "@jest/globals";
// import * as fs from "fs";
// import path from "path";

// process.env["DISABLE_AUTH"] = "false";
// process.env["LOCAL_FILE_PATH"] = "__tests__/files";

// const fileToCreate = {
//     path: "__tests__/files/blanc.png",
//     location: "FILE_SERVER",
//     file: fs.readFileSync("/home/ludovic/Pictures/blanc.png"),
// };

// const fileToCreateExternal = {
//     path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//     location: "EXTERNAL",
//     file: null,
// };

// async function prepareSession(): Promise<[supertest.SuperTest<any>, string]> {
//     // Sessie starten en inloggen om autorisatie te krijgen
//     const session = request(app);
//     const resultLogin = await session.post("/auth/login").send({
//         username: "administrator@trottoir.be",
//         password: "password",
//     });
//     expect(resultLogin.status).toBe(302);
//     expect(resultLogin.headers).toHaveProperty("set-cookie");

//     // Deze constante zorgt ervoor dat de ingelogde gebruiker behouden blijft en dus autorisatie heeft.
//     const cookies = resultLogin.headers["set-cookie"].pop().split(";")[0];

//     return [session, cookies];
// }

// //const request = supertest(app);

// describe("Test FileRouting successful test", () => {
//     let session: any;
//     let cookies: string;
//     let id: string;
//     let external_id: string;

//     beforeAll(async () => {
//         const session_cookies = await prepareSession();
//         session = session_cookies[0];
//         cookies = session_cookies[1];
//     });

//     afterAll(async () => {});

//     test("should successfully upload a file", async () => {
//         const dirname = path.resolve();
//         const full_path = path.join(dirname, "__tests__/files/blanc.png");
//         const response = await session
//             .post("/file")
//             .set("Cookie", [cookies])
//             .field("path", fileToCreate.path)
//             .field("location", fileToCreate.location)
//             .attach("file", full_path);

//         expect(response.status).toBe(200);
//         id = response.body.id;
//     });

//     test("should successfully upload an external file", async () => {
//         const response = await session
//             .post("/file")
//             .set("Cookie", [cookies])
//             .field("path", fileToCreateExternal.path)
//             .field("location", fileToCreateExternal.location);

//         expect(response.status).toBe(200);
//         external_id = response.body.id;
//     });

//     test("Test searching existing file", async () => {
//         const result = await session
//             .get("/file/" + id)
//             .set("Cookie", [cookies]);
//         expect(result.status).toEqual(200);
//     });

//     test("Test searching existing external file", async () => {
//         const result = await session
//             .get("/file/" + external_id)
//             .set("Cookie", [cookies]);
//         expect(result.status).toEqual(302);
//         //expect(result.body).toEqual(file);
//     });
// });

// describe("Test Filerouting unsuccessful tests", () => {
//     let session: any;
//     let cookies: string;

//     beforeAll(async () => {
//         session = request(app);
//     });

//     // Bij deze test wordt er niet ingelogd en heeft de sessie dus geen autorisatie om request uit te voeren.
//     test("Test authorization", async () => {
//         const resultGet = await session.get("/file/47");
//         expect(resultGet.status).toEqual(401);

//         const resultAdd = await session.post("/file").send(fileToCreate);
//         expect(resultAdd.status).toEqual(401);
//     });
// });
