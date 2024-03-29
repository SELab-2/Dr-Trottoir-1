import { prisma } from "./prisma";

export async function initialiseBuilding() {
    const building1 = {
        name: "Building 1",
        ivago_id: "ivago-1",
        description: "Description of building 1",
        expected_time: 100,
        address_id: 1,
        manual_id: 1,

        deleted: false,
        syndicus_id: 4,

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
        syndicus_id: 1,

        hash: "abcd",
    };

    const building3 = {
        name: "Building 3",
        ivago_id: "ivago-3",
        description: "Description of building 3",
        expected_time: 150,
        address_id: 3,
        manual_id: 1,
        syndicus_id: 4,
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
