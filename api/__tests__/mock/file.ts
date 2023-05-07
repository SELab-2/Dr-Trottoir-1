import { FileLocation } from "@selab-2/groep-1-orm";
import { prisma } from "./prisma";

export async function initialiseFile() {
    const file1 = {
        path: "path/to/static_file",
        location: FileLocation.STATIC_FILES,
        mime: "unknown",
        size_in_bytes: 1024,
        user_id: 1,
        original_name: "file.txt",
    };

    const file2 = {
        path: "path/to/imgproxy_file",
        location: FileLocation.IMGPROXY,
        mime: "unknown",
        size_in_bytes: 1024,
        user_id: 1,
        original_name: "file.txt",
    };

    const file3 = {
        path: "test.txt",
        location: FileLocation.FILE_SERVER,
        mime: "unknown",
        size_in_bytes: 1024,
        user_id: 1,
        original_name: "file.txt",
    };

    const file4 = {
        path: "https://example.com/path/to/external_file",
        location: FileLocation.EXTERNAL,
        mime: "unknown",
        size_in_bytes: 1024,
        user_id: 1,
        original_name: "file.txt",
    };

    const file5 = {
        path: "__tests__/mock/files/test.txt",
        location: FileLocation.FILE_SERVER,
        mime: "unknown",
        size_in_bytes: 1024,
        user_id: 1,
        original_name: "file.txt",
    };

    const file6 = {
        path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        location: FileLocation.EXTERNAL,
        mime: "unknown",
        size_in_bytes: 1024,
        user_id: 1,
        original_name: "file.txt",
    };

    const file7 = {
        path: "__tests__/mock/file_server/test.txt",
        location: FileLocation.FILE_SERVER,
        mime: "unknown",
        size_in_bytes: 1024,
        user_id: 1,
        original_name: "file.txt",
    };

    await prisma.file.createMany({
        data: [file1, file2, file3, file4, file5, file6, file7],
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
