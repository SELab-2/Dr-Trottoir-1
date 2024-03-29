import { prisma } from "./prisma";

export async function initialiseRegion() {
    const region1 = {
        name: "Region 1",
    };

    const region2 = {
        name: "Region 2",
    };

    const region3 = {
        name: "Region 3",
    };

    await prisma.region.createMany({
        data: [region1, region2, region3],
        skipDuplicates: true,
    });
}
