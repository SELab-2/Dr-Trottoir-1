import app from "../../src/main";
import request from "supertest";

describe("Server.ts tests", () => {
    test("Math test", () => {
        expect(2 + 2).toBe(4);
    });
});

/*
Deze testen controleren dat de route de juiste statuscodes geeft bij het uitvoeren van een geldig request
(met autorisatie).
Bij elke test wordt een nieuwe action toegevoegd aan de databank. Op deze manier kunnen er geen fouten ontstaan
door entries die uit de databank verwijderd zijn. De data waarmee gewerkt wordt, zal dus sowieso in de databank
aanwezig zijn. Deze data wordt op het einde van de test weer verwijderd uit de databank.
 */
describe("Test ActionRouting successful requests", () => {
    test("Test creating and deleting new action", async () => {
        const session = await request(app);

        // Eerst moet er ingelogd worden om autorisatie te krijgen.
        const resultLogin = await session
            .post("/auth/login")
            .send({ username: "jens.pots@ugent.be", password: "password" });
        expect(resultLogin.status).toBe(302);
        expect(resultLogin.headers).toHaveProperty("set-cookie");

        // Deze constante zorgt ervoor dat de ingelogde gebruiker behouden blijft en dus autorisatie heeft.
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

// De volgende testen controleren dat de route de juiste foutcode meegeeft, wanneer een fout request wordt gestuurd.
describe("Test ActionRouting unsuccessful requests", () => {
    // Bij deze test wordt er niet ingelogd en heeft de sessie dus geen autorisatie om request uit te voeren.
    test("Test authorization", async () => {
        const session = await request(app);

        await session.get("/action").expect(403);

        await session.get("/action/5").expect(403);

        const resultAdd = await session
            .post("/action")
            .send({ description: "description" });
        expect(resultAdd.status).toEqual(403);
        expect(resultAdd.forbidden).toEqual(true);

        const resultUpdate = await session
            .patch("/action/1")
            .send({ description: "description" });
        expect(resultUpdate.status).toEqual(403);
        expect(resultUpdate.forbidden).toEqual(true);

        const resultDelete = await session.delete("/action/5");
        expect(resultDelete.status).toEqual(403);
        expect(resultDelete.forbidden).toEqual(true);
    });

    // Deze test probeert een action te zoeken/bewerken/verwijderen die niet in de databank zit.
    test("Test using an unexisting action", async () => {
        const session = await request(app);

        // Eerst moet er ingelogd worden om autorisatie te krijgen.
        const resultLogin = await session
            .post("/auth/login")
            .send({ username: "jens.pots@ugent.be", password: "password" });
        expect(resultLogin.status).toBe(302);
        expect(resultLogin.headers).toHaveProperty("set-cookie");

        const cookies = resultLogin.headers["set-cookie"].pop().split(";")[0];

        const resultGet = await session
            .get("/action/0")
            .set("Cookie", [cookies]);
        expect(resultGet.status).toEqual(404);
        expect(resultGet.notFound).toEqual(true);

        const resultUpdate = await session
            .patch("/action/0")
            .send({ description: "description" })
            .set("Cookie", [cookies]);
        expect(resultUpdate.status).toBe(404);
        expect(resultUpdate.notFound).toEqual(true);

        const resultDelete = await session
            .delete("/action/0")
            .set("Cookie", [cookies]);
        expect(resultDelete.status).toEqual(404);
        expect(resultDelete.notFound).toEqual(true);
    });

    // Deze test stuurt bij een request het verkeerde type id (string in plaats van int).
    test("Test using an wrong action type id", async () => {
        const session = await request(app);

        // Eerst moet er ingelogd worden om autorisatie te krijgen.
        const resultLogin = await session
            .post("/auth/login")
            .send({ username: "jens.pots@ugent.be", password: "password" });
        expect(resultLogin.status).toBe(302);
        expect(resultLogin.headers).toHaveProperty("set-cookie");

        const cookies = resultLogin.headers["set-cookie"].pop().split(";")[0];

        const resultGet = await session
            .get("/action/wrongtype")
            .set("Cookie", [cookies]);
        expect(resultGet.status).toEqual(400);
        expect(resultGet.badRequest).toEqual(true);

        const resultUpdate = await session
            .patch("/action/wrongtype")
            .send({ description: "description" })
            .set("Cookie", [cookies]);
        expect(resultUpdate.status).toBe(400);
        expect(resultUpdate.badRequest).toEqual(true);

        const resultDelete = await session
            .delete("/action/wrongtype")
            .set("Cookie", [cookies]);
        expect(resultDelete.status).toEqual(400);
        expect(resultDelete.badRequest).toEqual(true);
    });
});
