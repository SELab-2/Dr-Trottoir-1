import { Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { includeUser } from "./include";

export type BuildingQueryParameters = {
    take: number;
    skip: number;
    name: string;
    ivago_id: string;
    syndicus_id: number;
    deleted: boolean;
    sort: string[];
    ord: Array<"asc" | "desc">;
};

type BuildingAllInfo = Prisma.BuildingGetPayload<{
    select: {
        id: true;
        name: true;
        ivago_id: true;
        deleted: true;
        hash: false;
        address: true;
        syndicus: {
            include: {
                user: typeof includeUser;
            };
        };
        manual: true;
        images: {
            include: {
                image: true;
            };
        };
    };
}>;

export class BuildingQuery extends Query<
    BuildingQueryParameters,
    BuildingAllInfo
> {
    endpoint = "building";
}
