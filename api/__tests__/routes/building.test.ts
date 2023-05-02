import { afterAll, beforeAll, describe, test } from "@jest/globals";
import { AuthenticationLevel, Testrunner } from "../utilities/Testrunner";
import request from "supertest";
import app from "../../src/main";
import { resetDatabase, restoreTables } from "../mock/database";
import {
    badRequestForeignKey,
    badRequestResponse,
    forbiddenResponse,
    notFoundResponse,
} from "../utilities/constants";

describe("Building tests", () => {
    let runner: Testrunner;

    beforeAll(() => {
        const server = request(app);
        runner = new Testrunner(server);

        return resetDatabase();
    });

    afterEach(async () => {
        await restoreTables(
            "building",
            "building_image",
            "garbage",
            "round_building",
            "progress",
        );
    });

    describe("Succesful requests", () => {
        beforeEach(() => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
        });

        test("GET /building", async () => {
            const buildings = [
                {
                    address: {
                        city: "Sydney",
                        id: 1,
                        latitude: -33.865143,
                        longitude: 151.2099,
                        number: 42,
                        street: "Wallaby Way",
                        zip_code: 2000,
                    },
                    deleted: false,
                    id: 1,
                    images: [
                        {
                            building_id: 1,
                            id: 1,
                            image: {
                                id: 1,
                                location: "FILE_SERVER",
                                path: "path/to/file_server_image",
                                time: "2023-05-04T12:00:00.000Z",
                                user_id: 1,
                            },
                            image_id: 1,
                        },
                    ],
                    ivago_id: "ivago-1",
                    manual: {
                        id: 1,
                        location: "STATIC_FILES",
                        path: "path/to/static_file",
                    },
                    name: "Building 1",
                    syndicus: {
                        id: 1,
                        user: {
                            address_id: 3,
                            admin: false,
                            date_added: "2023-05-04T12:00:00.000Z",
                            deleted: false,
                            email: "syndicus@trottoir.be",
                            first_name: "Simon",
                            id: 4,
                            last_login: "2023-05-04T12:00:00.000Z",
                            last_name: "De Syndicus",
                            phone: "7894561230",
                            student: false,
                            super_student: false,
                        },
                        user_id: 4,
                    },
                },
                {
                    address: {
                        city: "Ghent",
                        id: 2,
                        latitude: 51.04732,
                        longitude: 3.7282,
                        number: 25,
                        street: "Sint-Pietersnieuwstraat",
                        zip_code: 9000,
                    },
                    deleted: false,
                    id: 2,
                    images: [
                        {
                            building_id: 2,
                            id: 2,
                            image: {
                                id: 2,
                                location: "IMGPROXY",
                                path: "path/to/img_proxy_image",
                                time: "2023-05-04T12:00:00.000Z",
                                user_id: 1,
                            },
                            image_id: 2,
                        },
                    ],
                    ivago_id: "ivago-2",
                    manual: {
                        id: 2,
                        location: "IMGPROXY",
                        path: "path/to/imgproxy_file",
                    },
                    name: "Building 2",
                    syndicus: {
                        id: 2,
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
                },
            ];

            await runner.get({
                url: "/building",
                expectedData: buildings,
            });
        });

        describe("GET /building/:id with different roles", () => {
            const building = {
                address: {
                    city: "Sydney",
                    id: 1,
                    latitude: -33.865143,
                    longitude: 151.2099,
                    number: 42,
                    street: "Wallaby Way",
                    zip_code: 2000,
                },
                deleted: false,
                id: 1,
                images: [
                    {
                        building_id: 1,
                        id: 1,
                        image: {
                            id: 1,
                            location: "FILE_SERVER",
                            path: "path/to/file_server_image",
                            time: "2023-05-04T12:00:00.000Z",
                            user_id: 1,
                        },
                        image_id: 1,
                    },
                ],
                ivago_id: "ivago-1",
                manual: {
                    id: 1,
                    location: "STATIC_FILES",
                    path: "path/to/static_file",
                },
                name: "Building 1",
                syndicus: {
                    id: 1,
                    user: {
                        address_id: 3,
                        admin: false,
                        date_added: "2023-05-04T12:00:00.000Z",
                        deleted: false,
                        email: "syndicus@trottoir.be",
                        first_name: "Simon",
                        id: 4,
                        last_login: "2023-05-04T12:00:00.000Z",
                        last_name: "De Syndicus",
                        phone: "7894561230",
                        student: false,
                        super_student: false,
                    },
                    user_id: 4,
                },
            };

            test("GET /building/:id as Student", async () => {
                runner.authLevel(AuthenticationLevel.STUDENT);

                await runner.get({
                    url: "/building/1",
                    expectedData: [building],
                });
            });

            test("GET /building/:id as Superstudent", async () => {
                runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
                await runner.get({
                    url: "/building/1",
                    expectedData: [building],
                });
            });

            test("GET /building/:id as Admin", async () => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
                await runner.get({
                    url: "/building/1",
                    expectedData: [building],
                });
            });
        });

        test("PATCH /building/:id", async () => {
            const building = (await runner.getRaw("/building/1")).body;
            building["name"] = "Building 1 New";
            // delete fields that are not part of the request, but set fields accordingly for the expectedResponse
            building["address_id"] = building["address"]["id"];
            delete building["address"];

            building["syndicus_id"] = building["syndicus"]["id"];
            delete building["syndicus"];

            building["manual_id"] = building["manual"]["id"];
            delete building["manual"];
            delete building["images"];

            const expected = {
                id: 1,
                name: "Building 1 New",
                ivago_id: "ivago-1",
                deleted: false,
                address: {
                    id: 1,
                    street: "Wallaby Way",
                    number: 42,
                    city: "Sydney",
                    zip_code: 2000,
                    latitude: -33.865143,
                    longitude: 151.2099,
                },
                syndicus: {
                    id: 1,
                    user_id: 4,
                    user: {
                        id: 4,
                        email: "syndicus@trottoir.be",
                        first_name: "Simon",
                        last_name: "De Syndicus",
                        last_login: "2023-05-04T12:00:00.000Z",
                        date_added: "2023-05-04T12:00:00.000Z",
                        phone: "7894561230",
                        address_id: 3,
                        student: false,
                        super_student: false,
                        admin: false,
                        deleted: false,
                    },
                },
                manual: {
                    id: 1,
                    path: "path/to/static_file",
                    location: "STATIC_FILES",
                },
                images: [
                    {
                        id: 1,
                        building_id: 1,
                        image_id: 1,
                        image: {
                            id: 1,
                            time: "2023-05-04T12:00:00.000Z",
                            location: "FILE_SERVER",
                            path: "path/to/file_server_image",
                            user_id: 1,
                        },
                    },
                ],
            };

            await runner.patch({
                url: "/building/1",
                data: building,
                expectedResponse: expected,
            });
        });

        test("POST /building", async () => {
            const building = {
                name: "new building",
                ivago_id: "ivago-new",
                address_id: 3,
                manual_id: 3,
                syndicus_id: 1,
            };

            const expectedBuilding = {
                name: "new building",
                ivago_id: "ivago-new",
                deleted: false,
                address: {
                    id: 3,
                    street: "Krijgslaan",
                    number: 281,
                    city: "Ghent",
                    zip_code: 9000,
                    latitude: 51.02776,
                    longitude: 3.71847,
                },
                syndicus: {
                    id: 1,
                    user_id: 4,
                    user: {
                        id: 4,
                        email: "syndicus@trottoir.be",
                        first_name: "Simon",
                        last_name: "De Syndicus",
                        last_login: "2023-05-04T12:00:00.000Z",
                        date_added: "2023-05-04T12:00:00.000Z",
                        phone: "7894561230",
                        address_id: 3,
                        student: false,
                        super_student: false,
                        admin: false,
                        deleted: false,
                    },
                },
                manual: {
                    id: 3,
                    path: "path/to/file_server_file",
                    location: "FILE_SERVER",
                },
                images: [],
            };

            await runner.post({
                url: "/building",
                data: building,
                expectedResponse: expectedBuilding,
                statusCode: 201,
            });
        });

        test("DELETE /building/:id", async () => {
            await runner.delete({
                url: "/building/1",
            });
        });
    });
    describe("Unsuccessful requests", () => {
        describe("Must have correct authorisation", () => {
            const newBuilding = {
                name: "new building",
                ivago_id: "ivago-new",
                address_id: 3,
                manual_id: 3,
                syndicus_id: 1,
            };
            describe("Can't use any path unauthorized", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                });
                test("Can't GET /building", async () => {
                    await runner.get({
                        url: "/building",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });
                test("Can't GET /building/:id", async () => {
                    await runner.get({
                        url: "/building/1",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });
                test("Can't POST /building", async () => {
                    await runner.post({
                        url: "/building",
                        data: newBuilding,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });
                test("Can't PATCH /building/:id", async () => {
                    await runner.patch({
                        url: "/building/1",
                        data: { name: "Adapted Building" },
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });
                test("Can't DELETE /building/:id", async () => {
                    await runner.delete({
                        url: "/building/1",
                        statusCode: 403,
                    });
                });
            });
            describe("Can't use any path as Student except concrete GET", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.STUDENT);
                });
                test("Can't GET /building", async () => {
                    await runner.get({
                        url: "/building",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });
                test("Can't POST /building", async () => {
                    await runner.post({
                        url: "/building",
                        data: newBuilding,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });
                test("Can't PATCH /building/:id", async () => {
                    await runner.patch({
                        url: "/building/1",
                        data: { name: "Adapted Building" },
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });
                test("Can't DELETE /building/:id", async () => {
                    await runner.delete({
                        url: "/building/1",
                        statusCode: 403,
                    });
                });
            });
        });
        describe("Cannot assign non-existent IDs", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            });
            test("Cannot assign non-existent syndicus ID", async () => {
                await runner.patch({
                    url: "/building/1",
                    data: {
                        syndicus_id: 0,
                    },
                    expectedResponse: badRequestForeignKey,
                    statusCode: 400,
                });
            });
            test("Cannot assign non-existent address ID", async () => {
                await runner.patch({
                    url: "/building/1",
                    data: { address_id: 0 },
                    expectedResponse: badRequestForeignKey,
                    statusCode: 400,
                });
            });
            test("Cannot assign non-existent manual ID", async () => {
                await runner.patch({
                    url: "/building/1",
                    data: { manual_id: 0 },
                    expectedResponse: badRequestForeignKey,
                    statusCode: 400,
                });
            });
        });
        describe("Cannot query for non-existent buildings ", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            });
            test("Cannot GET /building/20", async () => {
                await runner.get({
                    url: "/building/20",
                    expectedData: [notFoundResponse],
                    statusCode: 404,
                });
            });

            test("Cannot PATCH /building/20", async () => {
                await runner.patch({
                    url: "/building/20",
                    data: { name: "New Building Name" },
                    expectedResponse: notFoundResponse,
                    statusCode: 404,
                });
            });

            test("Cannot DELETE /building/20", async () => {
                await runner.delete({
                    url: "/building/20",
                    statusCode: 404,
                });
            });
        });
        describe("Cannot change buildings using wrong types", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            });

            test("PATCH using wrong key", async () => {
                await runner.patch({
                    url: "/building/1",
                    data: { bad_key: "foo" },
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });
            test("PATCH with correct key but wrong value type", async () => {
                await runner.patch({
                    url: "/building/1",
                    data: { name: 5 }, // int instead of string
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });
        });
    });

    afterAll(() => {
        app.close();
    });
});
