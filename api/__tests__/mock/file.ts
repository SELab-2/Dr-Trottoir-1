import { File } from "@selab-2/groep-1-orm";
import { prisma } from "./prisma";

export const manual = {
    id: 10,
    user_id: 1,
    original_name: "handleiding.pdf",
    size_in_bytes: 1024,
    mime: "application/pdf",
    path: "manual.pdf",
    createdAt: new Date("1970-01-01T00:00:00Z"),
    updatedAt: new Date("1970-01-01T00:00:00Z"),
} satisfies File;

export const image = {
    id: 2,
    user_id: 1,
    original_name: "camera.jpg",
    size_in_bytes: 1024,
    mime: "application/jpeg",
    path: "camera.jpg",
    createdAt: new Date("1970-01-01T00:00:00Z"),
    updatedAt: new Date("1970-01-01T00:00:00Z"),
} satisfies File;

export async function initialiseFiles() {
    await prisma.file.createMany({
        data: [manual, image],
    });
}
