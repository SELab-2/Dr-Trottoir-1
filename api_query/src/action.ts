import { Action } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type ActionQueryParameters = {
    take: number;
    skip: number;
    description: string;
    sort: string[];
    ord: string[];
};

export class ActionQuery extends Query<ActionQueryParameters, Action> {
    endpoint = "action";
}
