import { prisma } from "./prisma";

export async function initialiseGarbage() {
    const timestamp1: Date = new Date(Date.UTC(2023, 4, 4, 18, 0, 0));
    const timestamp2: Date = new Date(Date.UTC(2023, 4, 4, 12, 0, 0));
    const g1 = {
        pickup_time: timestamp1,
        description: "PMD buiten zetten",
        building_id: 4,
    };

    const g2 = {
        pickup_time: timestamp1,
        description: "REST-afval buiten zetten",
        building_id: 4,
    };

    const g3 = {
        pickup_time: timestamp2,
        description: "Containers binnen zetten",
        building_id: 4,
    };

    const g4 = {
        pickup_time: timestamp1,
        description: "Glasbak buiten zetten",
        building_id: 5,
    };

    const g5 = {
        pickup_time: timestamp2,
        description: "Glasbak binnen zetten",
        building_id: 5,
    };

    const g6 = {
        pickup_time: timestamp1,
        description: "Papier buiten zetten",
        building_id: 6,
    };

    await prisma.garbage.createMany({
        data: [g1, g2, g3, g4, g5, g6],
    });
}
