import app from "../../src/main";
import request from "supertest";
import { describe, expect, test } from "@jest/globals";
import supertest from "supertest";
import { v4 as uuidv4 } from "uuid";

const uid = uuidv4();

const buildingToCreate = {
    name: "BuildingName",
    ivago_id: "1234567890",
    syndicus_id: undefined,
    address_id: undefined,
    manual_id: uid,
};

const building = {
    id: undefined,
    name: "BuildingName",
    ivago_id: "1234567890",
    syndicus: {
        id: undefined,
        user_id: undefined,
        user: undefined,
    },
    address: undefined,
    manual: {
        id: uid,
        path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        location: "EXTERNAL",
    },
    images: [],
    deleted: false,
};

// schakel authenticatie in, ongeacht wat de runner in zijn .env heeft
process.env["DISABLE_AUTH"] = "false";

// Voor de testen uitgevoerd worden, moet de sessie gestart worden en moet autorisatie verkregen en bewaard worden.
// Daarnaast moeten bepaalde waarden aan de databank toegevoegd worden die gebruikt zullen worden in de testen.
async function prepareSession(): Promise<[supertest.SuperTest<any>, string]> {
    // Sessie starten en inloggen voor autorisatie
    const session = request(app);
    const resultLogin = await session.post("/auth/login").send({
        username: "administrator@trottoir.be",
        password: "password",
    });
    expect(resultLogin.status).toEqual(302);
    expect(resultLogin.headers).toHaveProperty("set-cookie");

    const cookies = resultLogin.headers["set-cookie"].pop().split(";")[0];

    // adres van een willekeurige gebruiker opzoeken
    const resultUser = await session.get("/user").set("Cookie", [cookies]);
    const user = resultUser.body[0];
    buildingToCreate.address_id = user.address_id;
    building.address = user.address;

    // Nieuwe syndicus toevoegen om te gebruiken bij het aanmaken van het gebouw
    const resultSyndicus = await session
        .post("/syndicus")
        .send({ user_id: user.id })
        .set("Cookie", [cookies]);
    buildingToCreate.syndicus_id = resultSyndicus.body.id;

    // Gebouw toevoegen om te gebruiken tijdens de testen.
    const resultAdd = await session
        .post("/building")
        .send(buildingToCreate)
        .set("Cookie", [cookies]);
    expect(resultAdd.status).toEqual(201);
    building.id = resultAdd.body.id;
    building.syndicus.id = buildingToCreate.syndicus_id;
    building.syndicus.user_id = user.id;
    building.manual.id = uid;
    delete user.address;
    delete user.regions;
    building.syndicus.user = user;

    return [session, cookies];
}

async function closeSession(
    session: supertest.SuperTest<any>,
    cookies: string,
) {
    // Toegevoegde gebouw terug verwijderen uit de databank
    const resultDelete = await session
        .delete("/building/" + building.id)
        .send({ hardDelete: true })
        .set("Cookie", [cookies]);
    expect(resultDelete.status).toEqual(200);

    const resultDeleteSyndicus = await session
        .delete("/syndicus/" + buildingToCreate.syndicus_id)
        .set("Cookie", [cookies]);
    expect(resultDeleteSyndicus.status).toEqual(200);
}

describe("Test BuildingRouting successful tests", () => {
    let session: any;
    let cookies: string;

    beforeAll(async () => {
        const session_cookies = await prepareSession();
        session = session_cookies[0];
        cookies = session_cookies[1];
    });

    // Na het uitvoeren van alle testen moeten zowel het gebouw als de syndicus terug verwijderd worden uit de databank.
    afterAll(async () => {
        await closeSession(session, cookies);
    });

    test("Test searching existing building", async () => {
        const result = await session
            .get("/building/" + building.id)
            .set("Cookie", [cookies]);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual(building);
    });

    test("Test updating existing building", async () => {
        const changedBuilding = {
            id: building.id,
            name: "NewName",
            ivago_id: building.ivago_id,
            syndicus_id: buildingToCreate.syndicus_id,
            address_id: buildingToCreate.address_id,
            manual_id: buildingToCreate.manual_id,
            deleted: false,
        };

        const result = await session
            .patch("/building/" + building.id)
            .send({ name: "NewName" })
            .set("Cookie", [cookies]);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual(changedBuilding);

        building.name = changedBuilding.name;
    });
});

describe("Test BuildingRouting unsuccessful tests", () => {
    let session: any;
    let cookies: string;

    beforeAll(async () => {
        const session_cookies = await prepareSession();
        session = session_cookies[0];
        cookies = session_cookies[1];
    });

    // Na het uitvoeren van alle testen moeten zowel het gebouw als de syndicus terug verwijderd worden uit de databank.
    afterAll(async () => {
        await closeSession(session, cookies);
    });

    // Bij deze test wordt er niet ingelogd en heeft de sessie dus geen autorisatie om request uit te voeren.
    test("Test authorization", async () => {
        const resultGet = await session.get("/building");
        expect(resultGet.status).toEqual(403);
        expect(resultGet.forbidden).toEqual(true);

        const resultGetId = await session.get("/building/" + building.id);
        expect(resultGetId.status).toEqual(403);
        expect(resultGetId.forbidden).toEqual(true);

        const resultAdd = await session
            .post("/building")
            .send(buildingToCreate);
        expect(resultAdd.status).toEqual(403);
        expect(resultAdd.forbidden).toEqual(true);

        const resultUpdate = await session
            .patch("/building/" + building.id)
            .send(buildingToCreate);
        expect(resultUpdate.status).toEqual(403);
        expect(resultUpdate.forbidden).toEqual(true);

        const resultDelete = await session.delete("/building/" + building.id);
        expect(resultDelete.status).toEqual(403);
        expect(resultDelete.forbidden).toEqual(true);
    });

    // Deze test probeert de id's van syndicus, address en manual te wijzigen naar onbestaande id's
    test("Test id's to unexisting id's", async () => {
        const resultSyndicus = await session
            .patch("/building/" + building.id)
            .send({ syndicus_id: 0 })
            .set("Cookie", [cookies]);
        expect(resultSyndicus.status).toEqual(500);

        const resultAddress = await session
            .patch("/building/" + building.id)
            .send({ address_id: 0 })
            .set("Cookie", [cookies]);
        expect(resultAddress.status).toEqual(500);

        const resultManual = await session
            .patch("/building/" + building.id)
            .send({ manual_id: "0" })
            .set("Cookie", [cookies]);
        expect(resultManual.status).toEqual(500);
    });

    // Deze test probeert requests uit te voeren op een onbestaand gebouw
    test("Test using an unexisting building", async () => {
        const resultGet = await session
            .get("/building/0")
            .set("Cookie", [cookies]);
        expect(resultGet.status).toEqual(404);
        expect(resultGet.notFound).toEqual(true);

        const resultUpdate = await session
            .patch("/building/0")
            .send({ name: "Name" })
            .set("Cookie", [cookies]);
        expect(resultUpdate.status).toEqual(404);
        expect(resultUpdate.notFound).toEqual(true);

        const resultDelete = await session
            .delete("/building/0")
            .set("Cookie", [cookies]);
        expect(resultDelete.status).toEqual(404);
        expect(resultDelete.notFound).toEqual(true);
    });

    // Deze test gebruikt foute types bij het toevoegen/aanpassen van een gebouw
    test("Test using wrong type", async () => {
        // String in plaats van int
        const result1 = await session
            .patch("/building/" + building.id)
            .send({ syndicus_id: "string in plaats van int" })
            .set("Cookie", [cookies]);
        expect(result1.status).toEqual(400);
        expect(result1.badRequest).toEqual(true);

        // Getal in plaats van string
        const result2 = await session
            .patch("/building/" + building.id)
            .send({ ivago_id: 5 })
            .set("Cookie", [cookies]);
        expect(result2.status).toEqual(400);
        expect(result2.badRequest).toEqual(true);

        // Boolean in plaats van string
        const result3 = await session
            .patch("/building/" + building.id)
            .send({ name: true })
            .set("Cookie", [cookies]);
        expect(result3.status).toEqual(400);
        expect(result3.badRequest).toEqual(true);
    });
});

// Server sluiten nadat alle testen uitgevoerd zijn
app.close();
