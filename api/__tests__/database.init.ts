import { prisma } from "../src/prisma";
// @ts-ignore
import crypto from "crypto";
import { FileLocation, ProgressImageType } from "@selab-2/groep-1-orm";

export async function initialiseDatabase() {
    await initialiseRegion();
    await initialiseAddress();
    await initialiseUser();
    await initialiseUserRegion();
    await initialiseFile();
    await initialiseImage();
    await initialiseBuilding();
    await initialiseBuildingImages();
    await initialiseSyndicus();
    await initialiseAction();
    await initialiseGarbage();
    await initialiseRound();
    await initialiseRoundBuilding();
    await initialiseSchedule();
    await initialiseProgress();
    await initialiseProgressImage();
}

async function initialiseRegion() {
    const region1 = {
        name: "Region 1",
        deleted: false,
    };

    const region2 = {
        name: "Region 2",
        deleted: false,
    };

    const region3 = {
        name: "Region 3",
        deleted: false,
    };

    await prisma.region.createMany({
        data: [region1, region2, region3],
    });
}

async function initialiseAddress() {
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

async function initialiseUser() {
    const timestamp: Date = new Date(Date.UTC(2023, 4, 4, 12, 0, 0));

    const student_salt = crypto.randomBytes(32).toString("hex");
    const student_hash = crypto
        .createHash("sha256")
        .update("student" + student_salt)
        .digest("hex");
    const student = {
        email: "student@trottoir.be",
        first_name: "Dirk",
        last_name: "De Student",
        date_added: timestamp,
        last_login: timestamp,
        phone: "0123456789",
        address_id: 1,

        student: true,
        super_student: false,
        admin: false,

        salt: student_salt,
        hash: student_hash,
    };

    const ss_salt = crypto.randomBytes(32).toString("hex");
    const ss_hash = crypto
        .createHash("sha256")
        .update("student" + ss_salt)
        .digest("hex");

    const superStudent = {
        email: "superstudent@trottoir.be",
        first_name: "Toon",
        last_name: "De Superstudent",
        date_added: timestamp,
        last_login: timestamp,
        phone: "9876543210",
        address_id: 2,

        student: false,
        super_student: true,
        admin: false,

        salt: ss_salt,
        hash: ss_hash,
    };

    const admin_salt = crypto.randomBytes(32).toString("hex");
    const admin_hash = crypto
        .createHash("sha256")
        .update("student" + admin_salt)
        .digest("hex");
    const admin = {
        email: "administrator@trottoir.be",
        first_name: "Mario",
        last_name: "De Administrator",
        date_added: timestamp,
        last_login: timestamp,
        phone: "6549873210",
        address_id: 2,

        student: false,
        super_student: false,
        admin: true,

        salt: admin_salt,
        hash: admin_hash,
    };

    const syndicus_salt = crypto.randomBytes(32).toString("hex");
    const syndicus_hash = crypto
        .createHash("sha256")
        .update("syndicus" + syndicus_salt)
        .digest("hex");
    const syndicus = {
        email: "syndicus@trottoir.be",
        first_name: "Simon",
        last_name: "De Syndicus",
        date_added: timestamp,
        last_login: timestamp,
        phone: "7894561230",
        address_id: 1,

        student: false,
        super_student: false,
        admin: false,

        salt: syndicus_salt,
        hash: syndicus_hash,
    };

    await prisma.user.createMany({
        data: [student, superStudent, admin, syndicus],
    });
}

async function initialiseUserRegion() {
    const entry = {
        user_id: 1,
        region_id: 1,
    };

    const entry2 = {
        user_id: 2,
        region_id: 2,
    };

    await prisma.userRegion.createMany({
        data: [entry, entry2],
    });
}

async function initialiseFile() {
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

async function initialiseImage() {
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

async function initialiseBuilding() {
    const password_b1 = crypto
        .createHash("sha256")
        .update("password_building1")
        .digest("hex");
    const building1 = {
        name: "Building 1",
        ivago_id: "ivago-1",
        address_id: 1,
        manual_id: 1,

        hash: password_b1,
    };

    const password_b2 = crypto
        .createHash("sha256")
        .update("password_building2")
        .digest("hex");
    const building2 = {
        name: "Building 2",
        ivago_id: "ivago-2",
        address_id: 2,
        manual_id: 2,

        hash: password_b2,
    };

    const password_b3 = crypto
        .createHash("sha256")
        .update("password_building3")
        .digest("hex");

    const building3 = {
        name: "Building 3",
        ivago_id: "ivago-3",
        address_id: 3,
        manual_id: 3,

        hash: password_b3,
    };

    await prisma.building.createMany({
        data: [building1, building2, building3],
    });
}

async function initialiseBuildingImages() {
    const e1 = {
        building_id: 1,
        image_id: 1,
    };

    const e2 = {
        building_id: 2,
        image_id: 2,
    };

    const e3 = {
        building_id: 3,
        image_id: 3,
    };

    await prisma.buildingImages.createMany({
        data: [e1, e2, e3],
    });
}

async function initialiseSyndicus() {
    const syndicus1 = {
        user_id: 4,
    };

    const syndicus2 = {
        user_id: 1,
    };

    await prisma.syndicus.createMany({
        data: [syndicus1, syndicus2],
    });
}

async function initialiseAction() {
    const action1 = {
        description: "action 1",
    };

    const action2 = {
        description: "action 2",
    };

    await prisma.action.createMany({
        data: [action1, action2],
    });
}

async function initialiseGarbage() {
    const timestamp: Date = new Date(Date.UTC(2023, 4, 4, 12, 0, 0));
    const g1 = {
        pickup_time: timestamp,
        action_id: 1,
        building_id: 1,
    };

    const g2 = {
        pickup_time: timestamp,
        action_id: 2,
        building_id: 2,
    };

    await prisma.garbage.createMany({
        data: [g1, g2],
    });
}

async function initialiseRound() {
    const r1 = {
        name: "Round 1",
    };

    const r2 = {
        name: "Round 2",
    };

    await prisma.round.createMany({
        data: [r1, r2],
    });
}

async function initialiseRoundBuilding() {
    const e1 = {
        round_id: 1,
        building_id: 1,
    };

    const e2 = {
        round_id: 2,
        building_id: 2,
    };

    await prisma.roundBuilding.createMany({
        data: [e1, e2],
    });
}

async function initialiseSchedule() {
    const timestamp: Date = new Date(Date.UTC(2023, 4, 4, 12, 0, 0));

    const s1 = {
        day: timestamp,
        user_id: 1,
        round_id: 1,
    };

    const s2 = {
        day: timestamp,
        user_id: 2,
        round_id: 2,
    };

    await prisma.schedule.createMany({
        data: [s1, s2],
    });
}

async function initialiseProgress() {
    const timestamp: Date = new Date(Date.UTC(2023, 4, 4, 12, 0, 0));

    const p1 = {
        report: "Report 1",
        arrival: timestamp,
        departure: timestamp,

        building_id: 1,
        schedule_id: 1,
    };

    const p2 = {
        report: "Report 2",
        arrival: timestamp,
        departure: timestamp,

        building_id: 2,
        schedule_id: 2,
    };

    await prisma.progress.createMany({
        data: [p1, p2],
    });
}

async function initialiseProgressImage() {
    const pi1 = {
        type: ProgressImageType.ARRIVAL,
        description: "Description of progress image 1",
        image_id: 1,
        progress_id: 1,
    };

    const pi2 = {
        type: ProgressImageType.GARBAGE,
        description: "Description of progress image 2",
        image_id: 2,
        progress_id: 2,
    };

    await prisma.progressImage.createMany({
        data: [pi1, pi2],
    });
}
