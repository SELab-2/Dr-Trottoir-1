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
    methodNotAllowedResponse,
    notFoundResponse,
} from "../utilities/constants";

describe("User_region tests", () => {
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
        test("POST /user_region", async () => {
            const new_user_region = {
                user_id: 1,
                region_id: 3,
            };

            const expected = {
                region: { deleted: false, id: 3, name: "Region 3" },
                region_id: 3,
                user: {
                    address: {
                        city: "Sydney",
                        id: 1,
                        latitude: -33.865143,
                        longitude: 151.2099,
                        number: 42,
                        street: "Wallaby Way",
                        zip_code: 2000,
                    },
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
            };
            await runner.post({
                url: "/user_region",
                data: new_user_region,
                expectedResponse: expected,
            });

            //check if user is added to region

            const expectedRegion = [
                {
                    deleted: false,
                    id: 3,
                    name: "Region 3",
                    users: [
                        {
                            id: 3,
                            region_id: 3,
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
            ];

            await runner.get({
                url: "/region/3",
                expectedData: expectedRegion,
            });
        });

        test("GET /user_region", async () => {
            const expected = [
                {
                    id: 1,
                    region: { deleted: false, id: 1, name: "Region 1" },
                    region_id: 1,
                    user: {
                        address: {
                            city: "Sydney",
                            id: 1,
                            latitude: -33.865143,
                            longitude: 151.2099,
                            number: 42,
                            street: "Wallaby Way",
                            zip_code: 2000,
                        },
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
                {
                    id: 2,
                    region: { deleted: false, id: 2, name: "Region 2" },
                    region_id: 2,
                    user: {
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
            ];

            await runner.get({ url: "/user_region", expectedData: expected });
        });

        test("GET /user_region/:id", async () => {
            const expected = [
                {
                    id: 1,
                    region: { deleted: false, id: 1, name: "Region 1" },
                    region_id: 1,
                    user: {
                        address: {
                            city: "Sydney",
                            id: 1,
                            latitude: -33.865143,
                            longitude: 151.2099,
                            number: 42,
                            street: "Wallaby Way",
                            zip_code: 2000,
                        },
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
            ];

            await runner.get({ url: "/user_region/1", expectedData: expected });
        });

        test("DELETE /user_region/:id", async () => {
            await runner.delete({ url: "/user_region/1" });

            // verify that the user_region is truly deleted
            const expected = [
                {
                    id: 2,
                    region: { deleted: false, id: 2, name: "Region 2" },
                    region_id: 2,
                    user: {
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
            ];
            await runner.get({
                url: "/user_region",
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
            const new_user_region = {
                user_id: 1,
                region_id: 3,
            };

            describe("Cannot reach any path without authorisation", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                });

                test("Cannot reach GET /user_region", async () => {
                    await runner.get({
                        url: "/user_region",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach GET /user_region/:id", async () => {
                    await runner.get({
                        url: "/user_region/1",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /user_region", async () => {
                    await runner.post({
                        url: "/user_region",
                        data: new_user_region,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /user_region/:id", async () => {
                    await runner.delete({
                        url: "/user_region/1",
                        statusCode: 403,
                    });
                });
            });
            describe("Cannot reach any path as a student", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.STUDENT);
                });

                test("Cannot reach GET /user_region", async () => {
                    await runner.get({
                        url: "/user_region",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /user_region", async () => {
                    await runner.post({
                        url: "/user_region",
                        data: new_user_region,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /user_region/:id", async () => {
                    await runner.delete({
                        url: "/user_region/1",
                        statusCode: 403,
                    });
                });

                test("Cannot reach PATCH /user_region/:id", async () => {
                    await runner.patch({
                        url: "/user_region/1",
                        data: new_user_region,
                        expectedResponse: methodNotAllowedResponse,
                        statusCode: 405,
                    });
                });
            });
        });
        describe("The requested path must exist", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("Find a nonexistent user_region", async () => {
                await runner.get({
                    url: "/user_region/0",
                    expectedData: [notFoundResponse],
                    statusCode: 404,
                });
            });

            test("Delete a nonexistent user_region", async () => {
                await runner.delete({ url: "/user_region/0", statusCode: 404 });
            });
        });
        describe("The type of user_region id must be correct", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("GET request", async () => {
                await runner.get({
                    url: "/user_region/wrongtype",
                    expectedData: [badRequestResponse],
                    statusCode: 400,
                });
            });

            test("DELETE request", async () => {
                await runner.delete({
                    url: "/user_region/wrongtype",
                    statusCode: 400,
                });
            });
        });

        describe("Method has to be allowed", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("PATCH /user_region/:id", async () => {
                const new_user_region = {
                    user_id: 1,
                    region_id: 2,
                };

                await runner.patch({
                    url: "/user_region/1",
                    data: new_user_region,
                    expectedResponse: methodNotAllowedResponse,
                    statusCode: 405,
                });
            });
        });

        afterAll(() => {
            app.close();
        });
    });
});
