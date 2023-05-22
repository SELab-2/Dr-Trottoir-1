import { prisma } from "./prisma";

export async function initialiseAddress() {
    // addresses for tests
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

    const address4 = {
        street: "Krijgslaan",
        number: 282,
        city: "Ghent",
        zip_code: 9000,
        latitude: 51.02776,
        longitude: 3.71847,
    };

    // addresses for demo
    const deBrug = {
        street: "Sint-Pietersnieuwstraat",
        number: 45,
        city: "Ghent",
        zip_code: 9000,
        latitude: 51.0457,
        longitude: 3.72697,
    };

    const dunant = {
        street: "Henri Dunantlaan",
        number: 2,
        city: "Ghent",
        zip_code: 9000,
        latitude: 50.75342,
        longitude: 5.09142,
    };

    const sterre = {
        street: "Krijgslaan 281",
        number: 281,
        city: "Ghent",
        zip_code: 9000,
        latitude: 51.02776,
        longitude: 3.71847,
    };

    await prisma.address.createMany({
        data: [address1, address2, address3, address4, deBrug, dunant, sterre],
    });
}
