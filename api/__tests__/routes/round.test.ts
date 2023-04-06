// @ts-ignore
import { Response, supertest } from "supertest";
import {
    deleteDatabaseData,
    initialiseDatabase,
    restoreTables,
} from "../database.init";
import { Testrunner } from "../testrunner";

// setup the database with mock fields
beforeAll(async () => {
    await deleteDatabaseData();
    await initialiseDatabase();
});

describe("Succesful tests", () => {
    let testRunner: Testrunner;
    beforeAll(async () => {
        testRunner = await Testrunner.newInstance();
    });

    test("Create a new round", async () => {
        await testRunner.post("/round", { name: "Test round" });
        await restoreTables("round");
    });

    test("List all rounds", async () => {
        const expected = [{}];
        await testRunner.get("/round", expected);
    });

    test("List details about specific round", () => {});

    test("Add a building to the round", () => {});

    test("Remove a building from the round", () => {});

    test("Change the name of the round", () => {});

    test("Remove a round", () => {});

    afterAll(() => {
        testRunner.close();
    });
});
describe("Unsuccessful tests", () => {
    test("Set non-unique name for the round", () => {});

    test("Add a non-existent building to the round", () => {});

    test("Student attempt to create a round", () => {});
    test("Student attempt to alter a round", () => {});
    test("Student attempt to delete a round", () => {});
});
