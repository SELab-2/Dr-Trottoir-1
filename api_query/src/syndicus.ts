import { Syndicus } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type SyndicusQueryParameters = {
    take: number;
    skip: number;
    login_before: number;
    login_after: number;
    added_before: Date;
    added_after: Date;
    name: string;
    user: number;
    sort: string[];
    ord: string[];
};

export class SyndicusQuery extends Query<SyndicusQueryParameters, Syndicus> {
    endpoint = "syndicus";
}
