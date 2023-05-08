import { File, Image } from "@selab-2/groep-1-orm";
import { prisma } from "./prisma";

export const manual = {
    id: 1,
    user_id: 1,
    original_name: "handleiding.pdf",
    size_in_bytes: 1024,
    mime: "application/pdf",
    path: "manual.pdf",
    location: "FILE_SERVER",
    createdAt: new Date("1970-01-01T00:00:00"),
    updatedAt: new Date("1970-01-01T00:00:00"),
} satisfies File;

export const image = {
    id: 1,
    time: new Date("1970-01-01T00:00:00"),
    location: "IMGPROXY",
    path: "image.jpg",
    user_id: 1,
} satisfies Image;

export async function initialiseFiles() {
    await prisma.file.create({
        data: manual,
    });

    await prisma.image.create({
        data: image,
    });
}
