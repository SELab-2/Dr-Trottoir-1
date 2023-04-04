import { Building } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type BuildingQueryParameters = {
    take: number;
    skip: number;
    name: string;
    ivage_id: string;
    syndicus_id: number;
    deleted: boolean;
    sort: string[];
    ord: Array<"asc" | "desc">;
};

export class BuildingQuery extends Query<BuildingQueryParameters, Building> {
    endpoint = "building";
}
