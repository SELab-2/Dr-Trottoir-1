import { File } from "@selab-2/groep-1-orm";
import { prisma } from "./prisma";
import { writeFileSync } from "fs";
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

    await prisma.file.create({
        data: image,
    });
}
