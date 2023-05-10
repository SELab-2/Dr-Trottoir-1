import crypto from "crypto";
import { prisma } from "./prisma";

export async function initialiseBuilding() {
    const building1 = {
        name: "Building 1",
        ivago_id: "ivago-1",
        address_id: 1,
        manual_id: 1,

        deleted: false,
        syndicus_id: 1,

        hash: "aaaa",
    };

    const building2 = {
        name: "Building 2",
        ivago_id: "ivago-2",
        address_id: 2,
        manual_id: 2,
        deleted: false,
        syndicus_id: 2,

        hash: "abcd",
    };

    const building3 = {
        name: "Building 3",
        ivago_id: "ivago-3",
        address_id: 3,
        manual_id: 3,
        syndicus_id: 1,
        deleted: true,

        hash: "klmno",
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
