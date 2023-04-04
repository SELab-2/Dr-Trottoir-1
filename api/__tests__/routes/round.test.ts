import { obtainSession } from "../util";
// @ts-ignore
import supertest from "supertest";
import { Prisma } from "@selab-2/groep-1-orm";
import { prisma } from "../../src/prisma";
import { initialiseDatabase } from "../database.init";

// setup the database with mock fields
beforeAll(async () => {});

describe("Succesful tests", () => {
    let session: supertest.SuperTest<any>;
    beforeAll(async () => {
        // delete all data
        await prisma.$executeRaw(
            Prisma.sql`select 'truncate table \"' || tablename || '\" cascade;' from pg_tables;\n`,
        );

        // load new data
        await initialiseDatabase();

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

    test("Student attempt to create a round", () => {});
    test("Student attempt to alter a round", () => {});
    test("Student attempt to delete a round", () => {});
});
