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

describe("Region tests", () => {
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
        test("POST /region", async () => {
            const newRegion = {
                name: "new Region",
            };

            const expectedRegion = {
                name: "new Region",
                deleted: false,
                users: [],
            };

            await runner.post({
                url: "/region",
                data: newRegion,
                expectedResponse: expectedRegion,
            });
        });

        test("GET /region", async () => {
            const expected = [
                {
                    deleted: false,
                    id: 1,
                    name: "Region 1",
                    users: [
                        {
                            id: 1,
                            region_id: 1,
                            user: {
                                address_id: 1,
                                admin: false,
                                date_added: "2023-05-04T12:00:00.000Z",
                                deleted: false,
                                email: "student@trottoir.be",
                                first_name: "Dirk",
                                id: 1,
                                last_login: "2023-05-04T12:00:00.000Z",
                                last_name: "De Student",
                                phone: "0123456789",
                                student: true,
                                super_student: false,
                            },
                            user_id: 1,
                        },
                    ],
                },
                {
                    deleted: false,
                    id: 2,
                    name: "Region 2",
                    users: [
                        {
                            id: 2,
                            region_id: 2,
                            user: {
                                address_id: 2,
                                admin: false,
                                date_added: "2023-05-04T12:00:00.000Z",
                                deleted: false,
                                email: "superstudent@trottoir.be",
                                first_name: "Toon",
                                id: 2,
                                last_login: "2023-05-04T12:00:00.000Z",
                                last_name: "De Superstudent",
                                phone: "9876543210",
                                student: false,
                                super_student: true,
                            },
                            user_id: 2,
                        },
                    ],
                },
                { deleted: false, id: 3, name: "Region 3", users: [] },
            ];

            await runner.get({ url: "/region", expectedData: expected });
        });

        test("GET /region/:id", async () => {
            const expected = [
                { id: 3, name: "Region 3", deleted: false, users: [] },
            ];

            await runner.get({ url: "/region/3", expectedData: expected });
        });

        test("PATCH /region/:id", async () => {
            const newRegion = {
                id: 3,
                name: "Updated Region 3",
            };

            const expectedRegion = {
                id: 3,
                name: "Updated Region 3",
                deleted: false,
                users: [],
            };

            await runner.patch({
                url: "/region/3",
                data: newRegion,
                expectedResponse: expectedRegion,
            });
        });

        test("DELETE /region/:id", async () => {
            await runner.delete({ url: "/region/1" });

            // verify that the region is truly deleted
            const expected = [
                {
                    deleted: false,
                    id: 2,
                    name: "Region 2",
                    users: [
                        {
                            id: 2,
                            region_id: 2,
                            user: {
                                address_id: 2,
                                admin: false,
                                date_added: "2023-05-04T12:00:00.000Z",
                                deleted: false,
                                email: "superstudent@trottoir.be",
                                first_name: "Toon",
                                id: 2,
                                last_login: "2023-05-04T12:00:00.000Z",
                                last_name: "De Superstudent",
                                phone: "9876543210",
                                student: false,
                                super_student: true,
                            },
                            user_id: 2,
                        },
                    ],
                },
                { deleted: false, id: 3, name: "Region 3", users: [] },
            ];
            await runner.get({
                url: "/region",
                expectedData: expected,
            });
        });

        describe("path for admin", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("SOFT DELETE /region/:id", async () => {
                const regionSoft = {
                    hardDelete: false,
                };
                await runner.delete({ url: "/region/3", data: regionSoft });

                // verify that the region is truly soft deleted
                const expected = [
                    {
                        deleted: false,
                        id: 1,
                        name: "Region 1",
                        users: [
                            {
                                id: 1,
                                region_id: 1,
                                user: {
                                    address_id: 1,
                                    admin: false,
                                    date_added: "2023-05-04T12:00:00.000Z",
                                    deleted: false,
                                    email: "student@trottoir.be",
                                    first_name: "Dirk",
                                    id: 1,
                                    last_login: "2023-05-04T12:00:00.000Z",
                                    last_name: "De Student",
                                    phone: "0123456789",
                                    student: true,
                                    super_student: false,
                                },
                                user_id: 1,
                            },
                        ],
                    },
                    {
                        deleted: false,
                        id: 2,
                        name: "Region 2",
                        users: [
                            {
                                id: 2,
                                region_id: 2,
                                user: {
                                    address_id: 2,
                                    admin: false,
                                    date_added: "2023-05-04T12:00:00.000Z",
                                    deleted: false,
                                    email: "superstudent@trottoir.be",
                                    first_name: "Toon",
                                    id: 2,
                                    last_login: "2023-05-04T12:00:00.000Z",
                                    last_name: "De Superstudent",
                                    phone: "9876543210",
                                    student: false,
                                    super_student: true,
                                },
                                user_id: 2,
                            },
                        ],
                    },
                    { deleted: true, id: 3, name: "Region 3", users: [] },
                ];
                await runner.get({
                    url: "/region?deleted=true",
                    expectedData: expected,
                });
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
            const newRegion = {
                name: "new Region",
            };

            describe("Cannot reach any path without authorisation", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                });

                test("Cannot reach GET /region", async () => {
                    await runner.get({
                        url: "/region",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach GET /region/:id", async () => {
                    await runner.get({
                        url: "/region/1",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /region", async () => {
                    await runner.post({
                        url: "/region",
                        data: newRegion,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach PATCH /region/:id", async () => {
                    await runner.patch({
                        url: "/region/1",
                        data: newRegion,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /region/:id", async () => {
                    await runner.delete({
                        url: "/region/1",
                        statusCode: 403,
                    });
                });
            });

            describe("Cannot reach any path as a student", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.STUDENT);
                });

                test("Cannot reach GET /region", async () => {
                    await runner.get({
                        url: "/region",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /region", async () => {
                    await runner.post({
                        url: "/region",
                        data: newRegion,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach PATCH /region/:id", async () => {
                    await runner.patch({
                        url: "/region/1",
                        data: newRegion,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /region/:id", async () => {
                    await runner.delete({
                        url: "/region/1",
                        statusCode: 403,
                    });
                });
            });

            describe("The requested path must exist", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
                });

                test("Find a nonexistent region", async () => {
                    await runner.get({
                        url: "/region/0",
                        expectedData: [notFoundResponse],
                        statusCode: 404,
                    });

                    await runner.get({
                        url: "/region/-1",
                        expectedData: [notFoundResponse],
                        statusCode: 404,
                    });
                });

                test("Update a nonexistent region", async () => {
                    await runner.patch({
                        url: "/region/0",
                        data: newRegion,
                        expectedResponse: notFoundResponse,
                        statusCode: 404,
                    });
                });
                test("Delete a nonexistent region", async () => {
                    await runner.delete({ url: "/region/0", statusCode: 404 });
                });
            });

            describe("The type of region id must be correct", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
                });

                test("GET request", async () => {
                    await runner.get({
                        url: "/region/wrongtype",
                        expectedData: [badRequestResponse],
                        statusCode: 400,
                    });
                });

                test("PATCH request", async () => {
                    const newRegion = {
                        foo: "wrong name Region",
                    };

                    await runner.patch({
                        url: "/region/wrongtype",
                        data: newRegion,
                        expectedResponse: badRequestResponse,
                        statusCode: 400,
                    });
                });

                test("DELETE request", async () => {
                    await runner.delete({
                        url: "/region/wrongtype",
                        statusCode: 400,
                    });
                });
            });
        });
    });

    afterAll(() => {
        app.close();
    });
});
