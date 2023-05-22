import { prisma } from "./prisma";
import path from "path";

process.env[
    "FILE_STORAGE_DIRECTORY"
] = `${path.resolve()}/__tests__/mock/file_server`;

export const manual = {
    user_id: 1,
    original_name: "handleiding.pdf",
    size_in_bytes: 1024,
    mime: "application/pdf",
    path: "manual.pdf",
    createdAt: new Date("1970-01-01T00:00:00Z"),
    updatedAt: new Date("1970-01-01T00:00:00Z"),
};

export const testfile = {
    user_id: 2,
    original_name: "example.txt",
    size_in_bytes: 13,
    mime: "text/plain",
    path: "example.txt",
    createdAt: new Date("1970-01-01T00:00:00Z"),
    updatedAt: new Date("1970-01-01T00:00:00Z"),
};

export const image = {
    user_id: 1,
    original_name: "camera.jpg",
    size_in_bytes: 1024,
    mime: "application/jpeg",
    path: "camera.jpg",
    createdAt: new Date("1970-01-01T00:00:00Z"),
    updatedAt: new Date("1970-01-01T00:00:00Z"),
};

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
