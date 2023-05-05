import { Query } from "./query";

type Mail = {
    to: string;
    subject: string;
    content: string;
};

export class MailQuery extends Query<void, Mail, void> {
    endpoint = "mail";
}
