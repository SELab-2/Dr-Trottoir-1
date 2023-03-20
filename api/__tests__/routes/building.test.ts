import app from "../../src/main";
// @ts-ignore
import request from "supertest";

const buildingToCreate = {
    name: "BuildingName",
    ivago_id: "1234567890",
    syndicus_id: undefined,
    address_id: undefined,
    manual_id: 8,
};

const building = {
    id: undefined,
    name: "BuildingName",
    ivago_id: "1234567890",
    syndicus_id: undefined,
    syndicus: {
        id: undefined,
        user_id: undefined,
    },
    address_id: undefined,
    manual_id: undefined,
};

describe("Test BuildingRouting successful tests", () => {
    let session: any;
    let cookies: string;

    beforeAll(async () => {
        // Sessie starten en inloggen voor autorisatie
        session = request(app);
        const resultLogin = await session
            .post("/auth/login")
            .send({ username: "jens.pots@ugent.be", password: "password" });
        expect(resultLogin.status).toEqual(302);
        expect(resultLogin.headers).toHaveProperty("set-cookie");

        cookies = resultLogin.headers["set-cookie"].pop().split(";")[0];

        // adres van gebruiker opzoeken
        const resultUser = await session
            .get("/user/11")
            .set("Cookie", [cookies]);
        const user = resultUser.body;
        buildingToCreate.address_id = user.address_id;

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
        building.syndicus_id = resultAdd.body.syndicus_id;
        building.syndicus.id = resultAdd.body.syndicus_id;
        building.syndicus.user_id = user.id;
        building.address_id = resultAdd.body.address_id;
        building.manual_id = resultAdd.body.manual_id;
    });

    // Na het uitvoeren van alle testen moeten zowel het gebouw als de syndicus terug verwijderd worden uit de databank.
    afterAll(async () => {
        // Toegevoegde gebouw terug verwijderen uit de databank
        const resultDelete = await session
            .delete("/building/" + building.id)
            .set("Cookie", [cookies]);
        expect(resultDelete.status).toEqual(200);

        const resultDeleteSyndicus = await session
            .delete("/syndicus/" + buildingToCreate.syndicus_id)
            .set("Cookie", [cookies]);
        expect(resultDeleteSyndicus.status).toEqual(200);
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
            syndicus_id: building.syndicus_id,
            address_id: building.address_id,
            manual_id: building.manual_id,
        };

        const result = await session
            .patch("/building/" + building.id)
            .send({ name: "NewName" })
            .set("Cookie", [cookies]);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual(changedBuilding);

        building.name = changedBuilding.name;
    });

    // Deze test controleert de werking van de join-operator met manual
    test("Test join-operator with manual", async () => {
        const buildingWithManual = {
            ...building,
            manual: {
                id: building.manual_id,
                path: "user/files/manual.pdf",
            },
        };

        const result = await session
            .get("/building/" + building.id + "?join=manual")
            .set("Cookie", [cookies]);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual(buildingWithManual);
    });

    // Deze test controleert de werking van de join-operator met syndicus
    test("Test join-operator with syndicus", async () => {
        const resultUser = await session
            .get("/user/" + building.syndicus.user_id)
            .set("Cookie", [cookies]);
        expect(resultUser.status).toEqual(200);

        const buildingWithSyndicus = {
            id: building.id,
            name: building.name,
            ivago_id: building.ivago_id,
            syndicus_id: building.syndicus_id,
            syndicus: {
                id: building.syndicus_id,
                user_id: building.syndicus.user_id,
                user: resultUser.body,
            },
            address_id: building.address_id,
            manual_id: building.manual_id,
        };
        delete buildingWithSyndicus.syndicus.user.address;

        const result = await session
            .get("/building/" + building.id + "?join=syndicus")
            .set("Cookie", [cookies]);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual(buildingWithSyndicus);
    });

    // Deze test controleert dat de andere parameters bij de join-operator lege lijsten teruggeven
    test("Test join-parameters", async () => {
        const buildingWithJoin = {
            ...building,
            garbage: [],
            progress: [],
            rounds: [],
            images: [],
        };

        const result = await session
            .get(
                "/building/" +
                    building.id +
                    "?join=garbage,progress,rounds,images",
            )
            .set("Cookie", [cookies]);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual(buildingWithJoin);
    });
});

describe("Test BuildingRouting unsuccessful tests", () => {
    let session: any;
    let cookies: string;

    beforeAll(async () => {
        // Sessie starten en inloggen voor autorisatie
        session = request(app);
        const resultLogin = await session
            .post("/auth/login")
            .send({ username: "jens.pots@ugent.be", password: "password" });
        expect(resultLogin.status).toEqual(302);
        expect(resultLogin.headers).toHaveProperty("set-cookie");

        cookies = resultLogin.headers["set-cookie"].pop().split(";")[0];

        // adres van gebruiker opzoeken
        const resultUser = await session
            .get("/user/11")
            .set("Cookie", [cookies]);
        const user = resultUser.body;
        buildingToCreate.address_id = user.address_id;

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
        building.syndicus_id = resultAdd.body.syndicus_id;
        building.syndicus.id = resultAdd.body.syndicus_id;
        building.syndicus.user_id = user.id;
        building.address_id = resultAdd.body.address_id;
        building.manual_id = resultAdd.body.manual_id;
    });

    // Na het uitvoeren van alle testen moeten zowel het gebouw als de syndicus terug verwijderd worden uit de databank.
    afterAll(async () => {
        // Toegevoegde gebouw terug verwijderen uit de databank
        const resultDelete = await session
            .delete("/building/" + building.id)
            .set("Cookie", [cookies]);
        expect(resultDelete.status).toEqual(200);

        const resultDeleteSyndicus = await session
            .delete("/syndicus/" + buildingToCreate.syndicus_id)
            .set("Cookie", [cookies]);
        expect(resultDeleteSyndicus.status).toEqual(200);
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
            .send({ manual_id: 0 })
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
        expect(result1.status).toEqual(500);

        // Getal in plaats van string
        const result2 = await session
            .patch("/building/" + building.id)
            .send({ ivago_id: 5 })
            .set("Cookie", [cookies]);
        expect(result2.status).toEqual(500);

        // Boolean in plaats van string
        const result3 = await session
            .patch("/building/" + building.id)
            .send({ name: true })
            .set("Cookie", [cookies]);
        expect(result3.status).toEqual(500);
    });
});

// Server sluiten nadat alle testen uitgevoerd zijn
app.close();
