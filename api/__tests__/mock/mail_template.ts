import { prisma } from "./prisma";

export async function initialiseMailTemplate() {
    const mailTempalate1 = {
        name: "Vuilnis",
        mail_subject: "Vuilnis in $(building)",
        content: "In $(building) ligt er vuilnis op de grond",
    };

    const mailTempalate2 = {
        name: "Code",
        mail_subject: "Code werkt niet in $(building)",
        content: "In $(building) werkt $(code) niet meer",
    };

    const mailTempalate3 = {
        name: "Ivago",
        mail_subject: "Ivago is niet langs $(building) gekomen",
        content: "Ivago heeft $(garbage_type) niet meegenomen bij $(building)",
    };
    await prisma.mailTemplate.createMany({
        data: [mailTempalate1, mailTempalate2, mailTempalate3],
    });
}
