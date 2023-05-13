import { prisma } from "./prisma";

export async function initialiseRound() {
    const r1 = {
        name: "Round 1",
        description: "Description of round 1",
    };

    const r2 = {
        name: "Round 2",
        description: "Description of round 2",
    };

    await prisma.round.createMany({
        data: [r1, r2],
    });
}

export async function initialiseRoundBuilding() {
    const e1 = {
        round_id: 1,
        building_id: 1,
    };

    const e2 = {
        round_id: 2,
        building_id: 2,
    };

    await prisma.roundBuilding.createMany({
        data: [e1, e2],
    });
}
