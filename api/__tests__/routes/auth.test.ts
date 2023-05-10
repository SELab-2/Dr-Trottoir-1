import { describe, test } from "@jest/globals";
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
    unauthorizedResponse,
} from "../utilities/constants";

describe("Auth tests", () => {
    let runner: Testrunner;

    beforeAll(async () => {
        const server = request(app);
        runner = new Testrunner(server);
        return resetDatabase();
    });

    afterEach(async () => {
        await restoreTables();
    });

    describe("Succesful requests", () => {
        test("POST /login", async () => {
            const newLogin = {
                username: "student@trottoir.be",
                password: "student",
            };

            await runner.post({
                url: "/auth/login",
                data: newLogin,
                expectedResponse: {},
                statusCode: 302,
            });
        });

        test("POST /logout", async () => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            await runner.post({
                url: "/auth/logout",
                data: {},
                expectedResponse: {},
                statusCode: 302,
            });
        });

        test("GET / get current user", async () => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);

            const expected = {
                address: {
                    city: "Ghent",
                    id: 2,
                    latitude: 51.04732,
                    longitude: 3.7282,
                    number: 25,
                    street: "Sint-Pietersnieuwstraat",
                    zip_code: 9000,
                },
                address_id: 2,
                admin: false,
                date_added: "2023-05-04T12:00:00.000Z",
                email: "superstudent@trottoir.be",
                first_name: "Toon",
                id: 2,
                last_login: "2023-05-04T12:00:00.000Z",
                last_name: "De Superstudent",
                phone: "9876543210",
                student: false,
                super_student: true,
                syndicus: [],
            };
            await runner.get({
                url: "/auth/",
                expectedData: [expected],
                statusCode: 200,
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

        test("POST /login wrong password", async () => {
            const newLogin = {
                username: "student@trottoir.be",
                password: "student22",
            };

            await runner.post({
                url: "/auth/login",
                data: newLogin,
                expectedResponse: forbiddenResponse,
                statusCode: 403,
            });
        });

        test("GET / not logged in", async () => {
            await runner.get({
                url: "/auth/",
                expectedData: [unauthorizedResponse],
                statusCode: 401,
            });
        });
    });

    afterAll(() => {
        app.close();
    });
});
