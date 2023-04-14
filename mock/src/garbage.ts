import { prisma } from "./prisma";

export async function initialiseAction() {
    const action1 = {
        description: "action 1",
    };

    const action2 = {
        description: "action 2",
    };

    const action3 = {
        description: "Unlinked action",
    };

    await prisma.action.createMany({
        data: [action1, action2, action3],
    });
}

export async function initialiseGarbage() {
    const timestamp: Date = new Date(Date.UTC(2023, 4, 4, 12, 0, 0));
    const g1 = {
        pickup_time: timestamp,
        action_id: 1,
        building_id: 1,
    };

    const g2 = {
        pickup_time: timestamp,
        action_id: 2,
        building_id: 2,
    };

    await prisma.garbage.createMany({
        data: [g1, g2],
    });
}
