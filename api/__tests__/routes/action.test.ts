import app from "../../src/main";
import request from "supertest";

describe("Server.ts tests", () => {
    test("Math test", () => {
        expect(2 + 2).toBe(4);
    });
});

describe("Test ActionRouting successful requests", () => {
    /*
    Bij elke test wordt een nieuwe action toegevoegd aan de databank. Op deze manier kunnen er geen fouten ontstaan
    door entries die uit de databank verwijderd zijn. De data waarmee gewerkt wordt, zal dus sowieso in de databank
    aanwezig zijn. Deze data wordt op het einde van de test weer verwijderd uit de databank.
     */

    test("Test creating and deleting new action", async () => {
        const session = await request(app);

        // Eerst moet er ingelogd worden om autorisatie te krijgen.
        const resultLogin = await session
            .post("/auth/login")
            .send({ username: "jens.pots@ugent.be", password: "password" });
        expect(resultLogin.status).toBe(302);
        expect(resultLogin.headers).toHaveProperty("set-cookie");

        const cookies = resultLogin.headers["set-cookie"].pop().split(";")[0];

        // Nieuwe action toevoegen
        const resultAdd = await session
            .post("/action")
            .send({ description: "new action for testing" })
            .set("Cookie", [cookies]);
        expect(resultAdd.status).toEqual(201);
        expect(resultAdd.body["description"]).toEqual("new action for testing");

        // Uiteindelijk moet de nieuwe actie terug verwijderd worden.
        const resultDelete = await session
            .delete("/action/" + resultAdd.body["id"])
            .set("Cookie", [cookies]);
        expect(resultDelete.status).toEqual(200);
    });

    test("Test searching existing action", async () => {
        const session = await request(app);

        // Eerst moet er ingelogd worden om autorisatie te krijgen.
        const resultLogin = await session
            .post("/auth/login")
            .send({ username: "jens.pots@ugent.be", password: "password" });
        expect(resultLogin.status).toBe(302);
        expect(resultLogin.headers).toHaveProperty("set-cookie");

        const cookies = resultLogin.headers["set-cookie"].pop().split(";")[0];

        // Nieuwe action toevoegen
        const resultAdd = await session
            .post("/action")
            .send({ description: "new action for testing" })
            .set("Cookie", [cookies]);
        expect(resultAdd.status).toEqual(201);
        expect(resultAdd.body["description"]).toEqual("new action for testing");

        const resultGet = await session
            .get("/action/" + resultAdd.body["id"])
            .set("Cookie", [cookies]);
        expect(resultGet.status).toEqual(200);
        expect(resultGet.body).toEqual(resultAdd.body);

        // Uiteindelijk moet de nieuwe actie terug verwijderd worden.
        const resultDelete = await session
            .delete("/action/" + resultAdd.body["id"])
            .set("Cookie", [cookies]);
        expect(resultDelete.status).toEqual(200);
    });

    test("Test updating existing action", async () => {
        const session = await request(app);

        // Eerst moet er ingelogd worden om autorisatie te krijgen.
        const resultLogin = await session
            .post("/auth/login")
            .send({ username: "jens.pots@ugent.be", password: "password" });
        expect(resultLogin.status).toBe(302);
        expect(resultLogin.headers).toHaveProperty("set-cookie");

        const cookies = resultLogin.headers["set-cookie"].pop().split(";")[0];

        // Nieuwe waarde toevoegen
        const resultAdd = await session
            .post("/action")
            .send({ description: "new action for testing" })
            .set("Cookie", [cookies]);
        expect(resultAdd.status).toEqual(201);
        expect(resultAdd.body["description"]).toEqual("new action for testing");

        // Toegevoegde waarde bewerken
        const resultUpdate = await session
            .patch("/action/" + resultAdd.body["id"])
            .send({ description: "updated action description" })
            .set("Cookie", [cookies]);
        expect(resultUpdate.status).toEqual(200);
        expect(resultUpdate.body["description"]).toEqual(
            "updated action description",
        );

        // Controleren dat de waarde effectief bewerkt is in de databank
        const resultGet = await session
            .get("/action/" + resultAdd.body["id"])
            .set("Cookie", [cookies]);
        expect(resultGet.status).toEqual(200);
        expect(resultGet.body).toEqual(resultUpdate.body);

        // Uiteindelijk moet de nieuwe waarde terug verwijderd worden.
        const resultDelete = await session
            .delete("/action/" + resultAdd.body["id"])
            .set("Cookie", [cookies]);
        expect(resultDelete.status).toEqual(200);
    });
});
