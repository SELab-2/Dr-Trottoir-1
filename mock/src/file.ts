import { FileLocation } from "@selab-2/groep-1-orm";
import { prisma } from "./prisma";

export async function initialiseFile() {
    const file1 = {
        path: "path/to/static_file",
        location: FileLocation.STATIC_FILES,
    };

    const file2 = {
        path: "path/to/imgproxy_file",
        location: FileLocation.IMGPROXY,
    };

    const file3 = {
        path: "path/to/file_server_file",
        location: FileLocation.FILE_SERVER,
    };

    const file4 = {
        path: "https://example.com/path/to/external_file",
        location: FileLocation.EXTERNAL,
    };

    await prisma.file.createMany({
        data: [file1, file2, file3, file4],
    });
}

export async function initialiseImage() {
    const timestamp: Date = new Date(Date.UTC(2023, 4, 4, 12, 0, 0));
    const image1 = {
        time: timestamp,
        location: FileLocation.FILE_SERVER,
        path: "path/to/file_server_image",
        user_id: 1,
    };

    const image2 = {
        time: timestamp,
        location: FileLocation.IMGPROXY,
        path: "path/to/img_proxy_image",
        user_id: 1,
    };

    const image3 = {
        time: timestamp,
        location: FileLocation.EXTERNAL,
        path: "https://example.com/path/to/external_image",
        user_id: 2,
    };

    const image4 = {
        time: timestamp,
        location: FileLocation.STATIC_FILES,
        path: "path/to/static_file_image",
        user_id: 3,
    };

    await prisma.image.createMany({
        data: [image1, image2, image3, image4],
    });
}
