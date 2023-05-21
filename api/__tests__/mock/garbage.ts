import { prisma } from "./prisma";

export async function initialiseGarbage() {
    const timestamp: Date = new Date(Date.UTC(2023, 4, 4, 12, 0, 0));
    const g1 = {
        pickup_time: timestamp,
        description: "action 1",
        building_id: 1,
    };

    const g2 = {
        pickup_time: timestamp,
        description: "action 2",
        building_id: 2,
    };

    await prisma.garbage.createMany({
        data: [g1, g2],
    });
}
