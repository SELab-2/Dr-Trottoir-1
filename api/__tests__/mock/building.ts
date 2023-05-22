import { prisma } from "./prisma";
import {
    image,
    manual,
    manualDeBrug,
    manualDunant,
    manualSterre,
} from "./file";

export async function initialiseBuilding() {
    const building1 = {
        name: "Building 1",
        ivago_id: "ivago-1",
        description: "Description of building 1",
        expected_time: 100,
        address_id: 1,
        manual_id: 1,

        deleted: false,
        syndicus_id: 1,

        hash: "aaaa",
    };

    const building2 = {
        name: "Building 2",
        ivago_id: "ivago-2",
        description: "Description of building 2",
        expected_time: 200,
        address_id: 2,
        manual_id: 1,
        deleted: false,
        syndicus_id: 2,

        hash: "abcd",
    };

    const building3 = {
        name: "Building 3",
        ivago_id: "ivago-3",
        description: "Description of building 3",
        expected_time: 150,
        address_id: 3,
        manual_id: 1,
        syndicus_id: 1,
        deleted: true,

        hash: "klmno",
    };

    // buildings for demo
    const deBrug = {
        name: "Resto De Brug",
        ivago_id: "ivago-de-brug",
        description: "Resto De Brug van Universiteit Gent",
        expected_time: 100,
        address_id: 5,
        manual_id: manualDeBrug.id,
        syndicus_id: 3,
        hash: "visitor-de-brug",
        deleted: false,
    };

    const dunant = {
        name: "Resto Dunant",
        ivago_id: "ivago-dunant",
        description: "Resto Dunant van Universiteit Gent",
        expected_time: 200,
        address_id: 6,
        manual_id: manualDunant.id,
        syndicus_id: 3,
        hash: "visitor-dunant",
    };

    const sterre = {
        name: "Resto Sterre",
        ivago_id: "ivago-sterre",
        description: "Resto Sterre van Universiteit Gent",
        expected_time: 300,
        address_id: 7,
        manual_id: manualSterre.id,
        syndicus_id: 3,
        hash: "visitor-sterre",
    };

    await prisma.building.createMany({
        data: [building1, building2, building3, deBrug, dunant, sterre],
    });
}

export async function initialiseBuildingImages() {
    const e1 = {
        building_id: 1,
        image_id: 3,
    };

    const e2 = {
        building_id: 2,
        image_id: 3,
    };

    const e3 = {
        building_id: 3,
        image_id: 3,
    };

    await prisma.buildingImages.createMany({
        data: [e1, e2, e3],
    });
}
