import app from "../../src/main";
import { obtainSession } from "./util";
// @ts-ignore
import supertest from "supertest";

describe("Succesful tests", () => {
    let session: supertest.SuperTest<any>;
    beforeAll(async () => {
        session = await obtainSession();
    });

    test("Create a new round", () => {});

    test("List all rounds", () => {});

    test("List details about specific round", () => {});

    test("Add a building to the round", () => {});

    test("Remove a building from the round", () => {});

    test("Change the name of the round", () => {});

    test("Remove a round", () => {});
});
describe("Unsuccessful tests", () => {
    test("Set non-unique name for the round", () => {});

    test("Add a non-existent building to the round", () => {});

    test("", () => {});
});
