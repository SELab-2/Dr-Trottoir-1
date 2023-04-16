import { afterAll, beforeAll, describe, test } from "@jest/globals";
import { AuthenticationLevel, Testrunner } from "../utilities/Testrunner";
import request from "supertest";
import app from "../../src/main";
import { deleteDatabaseData, initialiseDatabase } from "../mock/database";

describe("Building tests", () => {
    let runner: Testrunner;

    beforeAll(async () => {
        const server = request(app);
        runner = new Testrunner(server);

        await deleteDatabaseData();
        await initialiseDatabase();
    });

    describe("Succesful requests", () => {
        test("GET /building", async () => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
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
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
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

            await runner.patch({
                url: "/building/1",
                data: building,
                expectedResponse: building,
            });
        });
    });
    describe("Unsuccesful requests", () => {});

    afterAll(() => {
        app.close();
    });
});
