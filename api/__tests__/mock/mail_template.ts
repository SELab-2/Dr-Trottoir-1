import { prisma } from "./prisma";

export async function initialiseMailTemplate() {
    const mailTemplate1 = {
        name: "Vuilnis",
        mail_subject: "Vuilnis in $(gebouw_naam)",
        content: "In $(gebouw_naam) ligt er vuilnis op de grond",
    };

    const mailTemplate2 = {
        name: "Code",
        mail_subject: "Code werkt niet in $(gebouw_naam)",
        content: "In $(gebouw_naam) werkt de code niet meer",
    };

    const mailTemplate3 = {
        name: "Ivago",
        mail_subject: "Ivago is niet langs $(gebouw_naam) gekomen",
        content: "Ivago heeft de ingeplande container niet meegenomen bij $(gebouw_naam)",
    };
    await prisma.mailTemplate.createMany({
        data: [mailTemplate1, mailTemplate2, mailTemplate3],
    });
}
