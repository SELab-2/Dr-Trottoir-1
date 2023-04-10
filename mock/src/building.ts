import crypto from "crypto";

import { PrismaClient } from "@selab-2/groep-1-orm";

const prisma = new PrismaClient();

/*
Bij het aanmaken van een nieuw gebouw worden ook nieuwe waarden toegevoegd aan de databank in de tabellen van
syndicus, adres en bestand. Deze tabellen kunnen enkel via deze functie gevuld worden en dus niet via een aparte
create-functie. De tabel van adres kan echter wel nog aangevuld worden via de functie createUser in het bestand user.ts.
 */
export async function initialiseBuilding() {
    const password_b1 = crypto
        .createHash("sha256")
        .update("password_building1")
        .digest("hex");
    const building1 = {
        name: "Building 1",
        ivago_id: "ivago-1",
        address_id: 1,
        manual_id: 1,

        hash: password_b1,
    };

    const password_b2 = crypto
        .createHash("sha256")
        .update("password_building2")
        .digest("hex");
    const building2 = {
        name: "Building 2",
        ivago_id: "ivago-2",
        address_id: 2,
        manual_id: 2,

        hash: password_b2,
    };

    const password_b3 = crypto
        .createHash("sha256")
        .update("password_building3")
        .digest("hex");

    const building3 = {
        name: "Building 3",
        ivago_id: "ivago-3",
        address_id: 3,
        manual_id: 3,

        hash: password_b3,
    };

    await prisma.building.createMany({
        data: [building1, building2, building3],
    });
}

export async function initialiseBuildingImages() {
    const e1 = {
        building_id: 1,
        image_id: 1,
    };

    const e2 = {
        building_id: 2,
        image_id: 2,
    };

    const e3 = {
        building_id: 3,
        image_id: 3,
    };

    await prisma.buildingImages.createMany({
        data: [e1, e2, e3],
    });
}
