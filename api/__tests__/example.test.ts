/**
 * File showing off the usage of Testrunner
 * mail_template.test.js is taken as a template for this test suite
 */
import { AuthenticationLevel, Testrunner } from "./utilities/Testrunner";
import request from "supertest";
import app from "../src/main";
import {
    deleteDatabaseData,
    initialiseDatabase,
    restoreTables,
} from "./mock/database";

describe("Example test suite", () => {
    let testRunner: Testrunner;

    /**
     * Acquire a reference to the server and create the Testrunner
     * Also set the whole database up cleanly ONCE
     */
    beforeAll(async () => {
        const server = request(app);
        testRunner = new Testrunner(server);

        // clean the database
        await deleteDatabaseData();
        await initialiseDatabase();

        // set the authentication level the runner should execute under
        // This can also be set in the beforeEach hook, depending on your test suite
        testRunner.authLevel(AuthenticationLevel.ADMINISTRATOR);
    });

    test("Example GET", async () => {
        // define values that are expected from GET /mail_template
        const expected = [
            {
                content: "In $(gebouw_naam) ligt er vuilnis op de grond",
                id: 1,
                mail_subject: "Vuilnis in $(gebouw_naam)",
                name: "Vuilnis",
            },
            {
                content: "In $(gebouw_naam) werkt de code niet meer",
                id: 2,
                mail_subject: "Code werkt niet in $(gebouw_naam)",
                name: "Code",
            },
            {
                content:
                    "Ivago heeft de ingeplande container niet meegenomen bij $(gebouw_naam)",
                id: 3,
                mail_subject: "Ivago is niet langs $(gebouw_naam) gekomen",
                name: "Ivago",
            },
        ];

        // let the runner run
        await testRunner.get({ url: "/mail_template", expectedData: expected });
    });

    test("Example POST", async () => {
        const newMailTemplate = {
            name: "new mail template",
            mail_subject: "new mail template subject $(gebouw_naam)",
            content: "new content for $(gebouw_naam)",
        };

        const expected = {
            id: 4,
            name: "new mail template",
            mail_subject: "new mail template subject $(gebouw_naam)",
            content: "new content for $(gebouw_naam)",
        };

        await testRunner.post({
            url: "/mail_template",
            data: newMailTemplate,
            expectedResponse: expected,
        });

        // clean up after ourselves
        await restoreTables();
    });

    test("Example PATCH", async () => {
        const newMailTemplate = {
            name: "Updated name mail template",
        };

        const expected = {
            id: 1,
            name: "Updated name mail template",
            mail_subject: "Vuilnis in $(gebouw_naam)",
            content: "In $(gebouw_naam) ligt er vuilnis op de grond",
        };

        await testRunner.patch({
            url: "/mail_template/1",
            data: newMailTemplate,
            // for succesful PATCH requests, expectedResponse should be equal to data
            // for PATCH requests that are expected to fail, provide the expected response
            expectedResponse: expected,
        });
    });

    test("Example DELETE", async () => {
        await testRunner.delete({ url: "/mail_template/1" });
    });

    afterEach(async () => {
        // clean up after ourselves
        // The tests must be kept idempotent => make sure you restore all tables you (might) have changed!
        // Also be very careful with the order of the restoration of tables!
        await restoreTables();
    });

    afterAll(() => {
        // close the app to release all resources
        app.close();
    });
});
