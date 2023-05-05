import { MailTemplateQuery} from "../src/mail_template";
import { describe,it,expect } from "@jest/globals";

describe("mail_template", () => {
    it("", () => {
        const target =
            "/mail_template?take=0&skip=5&";

        const url = new MailTemplateQuery().url({
            take: 0,
            skip: 5
        });

        expect(url).toEqual(target);
    });
});