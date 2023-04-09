import { Round } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type RoundQueryParameters = {
    take: number;
    skip: number;
    name: string;
    sort: string[];
    ord: Array<"asc" | "desc">;
};

export class RoundQuery extends Query<RoundQueryParameters, Round> {
    endpoint = "round";
}
