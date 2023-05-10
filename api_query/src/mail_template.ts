import { MailTemplate } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type MailTemplateQueryParameters = {
    take: number;
    skip: number;
    name: string;
    sort: string[];
    ord: Array<"asc" | "desc">;
};

export class MailTemplateQuery extends Query<
    MailTemplateQueryParameters,
    MailTemplate,
    MailTemplate
> {
    endpoint = "mail_template";
}
