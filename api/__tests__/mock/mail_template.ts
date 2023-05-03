import { prisma } from "./prisma";

export async function initialiseMailTemplate() {
    const mailTemplate1 = {
        name: "Vuilnis",
        mail_subject: "Vuilnis in $(building)",
        content: "In $(building) ligt er vuilnis op de grond",
    };

    const mailTemplate2 = {
        name: "Code",
        mail_subject: "Code werkt niet in $(building)",
        content: "In $(building) werkt $(code) niet meer",
    };

    const mailTemplate3 = {
        name: "Ivago",
        mail_subject: "Ivago is niet langs $(building) gekomen",
        content: "Ivago heeft $(garbage_type) niet meegenomen bij $(building)",
    };
    await prisma.mailTemplate.createMany({
        data: [mailTemplate1, mailTemplate2, mailTemplate3],
    });
}
