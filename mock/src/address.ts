import { PrismaClient } from "@selab-2/groep-1-orm";

const prisma = new PrismaClient();

export async function initialiseAddress() {
    const address1 = {
        street: "Wallaby Way",
        number: 42,
        city: "Sydney",
        zip_code: 2000,
        latitude: -33.865143,
        longitude: 151.2099,
    };

    const address2 = {
        street: "Sint-Pietersnieuwstraat",
        number: 25,
        city: "Ghent",
        zip_code: 9000,
        latitude: 51.04732,
        longitude: 3.7282,
    };

    const address3 = {
        street: "Krijgslaan",
        number: 281,
        city: "Ghent",
        zip_code: 9000,
        latitude: 51.02776,
        longitude: 3.71847,
    };

    await prisma.address.createMany({
        data: [address1, address2, address3],
    });
}
