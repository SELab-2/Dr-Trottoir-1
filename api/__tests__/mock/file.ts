import { File } from "@selab-2/groep-1-orm";
import { prisma } from "./prisma";

export const manual = {
    id: 1,
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

// manuals for demo
export const manualDeBrug = {
    id: 3,
    user_id: 7,
    original_name: "manual_de_brug.pdf",
    size_in_bytes: 18296,
    mime: "application/pdf",
    path: "manuals/manual_de_brug.pdf",
    createdAt: new Date("2023-05-20T18:57:05Z"),
    updatedAt: new Date("2023-05-20T18:57:05Z"),
} satisfies File;

export const manualDunant = {
    id: 4,
    user_id: 7,
    original_name: "manual_dunant.pdf",
    size_in_bytes: 17590,
    mime: "application/pdf",
    path: "manuals/manual_dunant.pdf",
    createdAt: new Date("2023-05-20T18:57:05Z"),
    updatedAt: new Date("2023-05-20T18:57:05Z"),
} satisfies File;

export const manualSterre = {
    id: 5,
    user_id: 7,
    original_name: "manual_sterre.pdf",
    size_in_bytes: 17872,
    mime: "application/pdf",
    path: "manuals/manual_sterre.pdf",
    createdAt: new Date("2023-05-20T18:57:05Z"),
    updatedAt: new Date("2023-05-20T18:57:05Z"),
} satisfies File;

export async function initialiseFiles() {
    await prisma.file.createMany({
        data: [manual, image, manualDeBrug, manualDunant, manualSterre],
    });
}
