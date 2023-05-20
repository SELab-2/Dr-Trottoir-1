import crypto from "crypto";
import { prisma } from "./prisma";

export async function initialiseUser() {
    const timestamp: Date = new Date(Date.UTC(2023, 4, 4, 12, 0, 0));

    const student_salt = crypto.randomBytes(32).toString("hex");
    const student_hash = crypto
        .createHash("sha256")
        .update("student" + student_salt)
        .digest("hex");

    // create student
    await prisma.user.create({
        data: {
            email: "student@trottoir.be",
            first_name: "Dirk",
            last_name: "De Student",
            date_added: timestamp,
            last_login: timestamp,
            phone: "0123456789",
            student: true,
            super_student: false,
            admin: false,
            salt: student_salt,
            hash: student_hash,
            address_id: 1,
        },
    });

    const ss_salt = crypto.randomBytes(32).toString("hex");
    const ss_hash = crypto
        .createHash("sha256")
        .update("super_student" + ss_salt)
        .digest("hex");

    // create super student
    await prisma.user.create({
        data: {
            email: "superstudent@trottoir.be",
            first_name: "Toon",
            last_name: "De Superstudent",
            date_added: timestamp,
            last_login: timestamp,
            phone: "9876543210",
            student: false,
            super_student: true,
            admin: false,

            salt: ss_salt,
            hash: ss_hash,

            address_id: 2,
        },
    });

    const admin_salt = crypto.randomBytes(32).toString("hex");
    const admin_hash = crypto
        .createHash("sha256")
        .update("administrator" + admin_salt)
        .digest("hex");

    // create admin
    await prisma.user.create({
        data: {
            email: "administrator@trottoir.be",
            first_name: "Mario",
            last_name: "De Administrator",
            date_added: timestamp,
            last_login: timestamp,
            phone: "6549873210",

            student: false,
            super_student: false,
            admin: true,

            salt: admin_salt,
            hash: admin_hash,

            address_id: 3,
        },
    });

    // create syndicus
    const syndicus_salt = crypto.randomBytes(32).toString("hex");
    const syndicus_hash = crypto
        .createHash("sha256")
        .update("syndicus" + syndicus_salt)
        .digest("hex");
    await prisma.user.create({
        data: {
            email: "syndicus@trottoir.be",
            first_name: "Simon",
            last_name: "De Syndicus",
            date_added: timestamp,
            last_login: timestamp,
            phone: "7894561230",

            student: false,
            super_student: false,
            admin: false,

            salt: syndicus_salt,
            hash: syndicus_hash,

            address_id: 3,
        },
    });

    const student_salt2 = crypto.randomBytes(32).toString("hex");
    const student_hash2 = crypto
        .createHash("sha256")
        .update("student" + student_salt)
        .digest("hex");

    // create  second student
    await prisma.user.create({
        data: {
            email: "student2@trottoir.be",
            first_name: "Dirk",
            last_name: "De Student",
            date_added: timestamp,
            last_login: timestamp,
            phone: "0123456789",
            student: true,
            super_student: false,
            admin: false,
            salt: student_salt2,
            hash: student_hash2,
            address_id: 1,
        },
    });
}

export async function initialiseUserRegion() {
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

export async function initialiseSyndicus() {
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
