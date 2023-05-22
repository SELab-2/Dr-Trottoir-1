import { describe, test } from "@jest/globals";
import { AuthenticationLevel, Testrunner } from "../utilities/Testrunner";
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

describe("Mail Template tests", () => {
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
        test("POST /mail_template", async () => {
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

            await runner.post({
                url: "/mail_template",
                data: newMailTemplate,
                expectedResponse: expected,
            });
        });

        test("GET /mail_template", async () => {
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

            await runner.get({ url: "/mail_template", expectedData: expected });
        });

        test("GET /mail_template with filter", async () => {
            const expected = [
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

            await runner.get({
                url: "/mail_template?name=o",
                expectedData: expected,
            });
        });

        test("GET /mail_template/:id", async () => {
            const expected = [
                {
                    id: 1,
                    name: "Vuilnis",
                    mail_subject: "Vuilnis in $(gebouw_naam)",
                    content: "In $(gebouw_naam) ligt er vuilnis op de grond",
                },
            ];

            await runner.get({
                url: "/mail_template/1",
                expectedData: expected,
            });
        });

        test("PATCH /mail_template/:id", async () => {
            const newMailTemplate = {
                name: "Updated name mail template",
            };

            const expected = {
                id: 1,
                name: "Updated name mail template",
                mail_subject: "Vuilnis in $(gebouw_naam)",
                content: "In $(gebouw_naam) ligt er vuilnis op de grond",
            };

            await runner.patch({
                url: "/mail_template/1",
                data: newMailTemplate,
                expectedResponse: expected,
            });
        });

        test("DELETE /mail_template/:id", async () => {
            await runner.delete({ url: "/mail_template/1" });

            // verify that the mail template is truly deleted
            const expected = [
                {
                    id: 2,
                    name: "Code",
                    mail_subject: "Code werkt niet in $(gebouw_naam)",
                    content: "In $(gebouw_naam) werkt de code niet meer",
                },
                {
                    id: 3,
                    name: "Ivago",
                    mail_subject: "Ivago is niet langs $(gebouw_naam) gekomen",
                    content:
                        "Ivago heeft de ingeplande container niet meegenomen bij $(gebouw_naam)",
                },
            ];
            await runner.get({
                url: "/mail_template",
                expectedData: expected,
            });
        });

        afterAll(() => {
            app.close();
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
            const newMailTemplate = {
                name: "new mail template",
                mail_subject: "new mail template subject $(building)",
                content: "new content for $(building)",
            };

            describe("Cannot reach any path without authorisation", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                });

                test("Cannot reach GET /mail_template", async () => {
                    await runner.get({
                        url: "/mail_template",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach GET /mail_template/:id", async () => {
                    await runner.get({
                        url: "/mail_template/1",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /mail_template", async () => {
                    await runner.post({
                        url: "/mail_template",
                        data: newMailTemplate,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach PATCH /mail_template/:id", async () => {
                    await runner.patch({
                        url: "/mail_template/1",
                        data: newMailTemplate,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /mail_template/:id", async () => {
                    await runner.delete({
                        url: "/mail_template/1",
                        statusCode: 403,
                    });
                });
            });
            describe("Cannot reach any path as a student", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.STUDENT);
                });

                test("Cannot reach GET /mail_template", async () => {
                    await runner.get({
                        url: "/mail_template",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach GET /mail_template/:id", async () => {
                    await runner.get({
                        url: "/mail_template/1",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /mail_template", async () => {
                    await runner.post({
                        url: "/mail_template",
                        data: newMailTemplate,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach PATCH /mail_template/:id", async () => {
                    await runner.patch({
                        url: "/mail_template/1",
                        data: newMailTemplate,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /mail_template/:id", async () => {
                    await runner.delete({
                        url: "/mail_template/1",
                        statusCode: 403,
                    });
                });
            });
        });
        describe("The requested path must exist", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("Find a nonexistent mail template", async () => {
                await runner.get({
                    url: "/mail_template/9",
                    expectedData: [notFoundResponse],
                    statusCode: 404,
                });
            });

            test("Update a nonexistent mail template", async () => {
                await runner.get({
                    url: "/mail_template/9",
                    expectedData: [notFoundResponse],
                    statusCode: 404,
                });
            });
            test("Delete a nonexistent mail template", async () => {
                await runner.delete({
                    url: "/mail_template/9",
                    statusCode: 404,
                });
            });
        });
        describe("The type of action id must be correct", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("GET request", async () => {
                await runner.get({
                    url: "/mail_template/wrongtype",
                    expectedData: [badRequestResponse],
                    statusCode: 400,
                });
            });

            test("PATCH request", async () => {
                const newMailTemplate = {
                    foo: "bar",
                };

                await runner.patch({
                    url: "/mail_template/wrongtype",
                    data: newMailTemplate,
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });

            test("DELETE request", async () => {
                await runner.delete({
                    url: "/mail_template/wrongtype",
                    statusCode: 400,
                });
            });
        });

        afterAll(() => {
            app.close();
        });
    });
});
