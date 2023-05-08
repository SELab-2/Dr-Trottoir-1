import crypto from "crypto";
import { prisma } from "./prisma";
import { image, manual } from "./file";

export async function initialiseBuilding() {
    const passwordB1 = crypto
        .createHash("sha256")
        .update("password_building1")
        .digest("hex");
    const building1 = {
        name: "Building 1",
        ivago_id: "ivago-1",
        address_id: 1,
        manual_id: manual.id,

        deleted: false,
        syndicus_id: 1,

        hash: passwordB1,
    };

    const passwordB2 = crypto
      .createHash("sha256")
      .update("password_building2")
      .digest("hex");
    const building2 = {
        name: "Building 2",
        ivago_id: "ivago-2",
        address_id: 2,
        manual_id: manual.id,
        deleted: false,
        syndicus_id: 2,

        hash: passwordB2,
    };

    const passwordB3 = crypto
      .createHash("sha256")
      .update("password_building3")
      .digest("hex");

    const building3 = {
        name: "Building 3",
        ivago_id: "ivago-3",
        address_id: 3,
        manual_id: manual.id,
        syndicus_id: 1,
        deleted: true,

        hash: passwordB3,
    };

    await prisma.building.createMany({
        data: [building1, building2, building3],
    });
}

export async function initialiseBuildingImages() {
    const e1 = {
        building_id: 1,
        image_id: image.id,
    };

    const e2 = {
        building_id: 2,
        image_id: image.id,
    };

    const e3 = {
        building_id: 3,
        image_id: image.id,
    };

    await prisma.buildingImages.createMany({
        data: [e1, e2, e3],
    });
}
