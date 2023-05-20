import { File } from "@selab-2/groep-1-orm";
import { prisma } from "./prisma";
import { writeFileSync } from "fs";
import path from "path";

process.env[
    "FILE_STORAGE_DIRECTORY"
] = `${path.resolve()}/__tests__/mock/file_server`;

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

export const testfile = {
    id: 11,
    user_id: 2,
    original_name: "example.txt",
    size_in_bytes: 13,
    mime: "text/plain",
    path: "example.txt",
    location: "FILE_SERVER",
    createdAt: new Date("1970-01-01T00:00:00"),
    updatedAt: new Date("1970-01-01T00:00:00"),
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
    await prisma.file.create({
        data: manual,
    });

    writeFileSync(
        `${process.env.FILE_STORAGE_DIRECTORY}/example.txt`,
        "hello world 0",
    );
    await prisma.file.create({
        data: testfile,
    });

    await prisma.image.create({
        data: image,
    });
}
