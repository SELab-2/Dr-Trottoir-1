import { describe, test } from "@jest/globals";
import { AuthenticationLevel, Testrunner } from "../utilities/Testrunner";
import request from "supertest";
import app from "../../src/main";
import {
    deleteDatabaseData,
    initialiseDatabase,
    restoreTables,
} from "../mock/database";

describe("Address tests", () => {
    let runner: Testrunner;

    beforeAll(async () => {
        const server = request(app);
        runner = new Testrunner(server);
        runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
    });

    beforeEach(async () => {
        await deleteDatabaseData();
        await initialiseDatabase();
    });

    afterAll(async () => {
        await deleteDatabaseData();
        await initialiseDatabase();
    });

    afterEach(async () => {
        await restoreTables();
    });

    describe("Succesful requests", () => {
        test("POST /address", async () => {
            const value = {
                street: "Straatnaam",
                longitude: 0.0,
                city: "Gent",
                number: 64,
                latitude: 0.0,
                zip_code: 2500,
            };

            await runner.post({
                url: "/address",
                data: value,
                expectedResponse: value,
            });
        });

        test("GET /address/:id", async () => {
            const expected = [
                {
                    id: 1,
                    street: "Wallaby Way",
                    number: 42,
                    city: "Sydney",
                    zip_code: 2000,
                    latitude: -33.865143,
                    longitude: 151.2099,
                },
            ];

            await runner.get({ url: "/address/1", expectedData: expected });
        });

        test("PATCH /address/:id", async () => {
            const expected = {
                street: "Wallaby Way",
                number: 42,
                city: "Gent",
                zip_code: 2000,
                latitude: -33.865143,
                longitude: 151.2099,
                id: 1,
            };

            await runner.patch({
                url: "/address/1",
                data: { city: "Gent" },
                expectedResponse: expected,
            });
        });

        afterAll(() => {
            app.close();
        });
    });
});
