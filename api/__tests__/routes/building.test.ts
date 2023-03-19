import app from "../../src/main";
// @ts-ignore
import request from "supertest";

const buildingToCreate = {
    name: "BuildingName",
    ivago_id: "1234567890",
    syndicus_id: undefined,
    address_id: undefined,
    manual_id: 1,
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
        console.log(buildingToCreate);

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
    });
});
