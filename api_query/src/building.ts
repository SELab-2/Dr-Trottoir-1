import { Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { includeUserWithoutAddress } from "./include";

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

// Het type dat het resultaat van een GET request modelleert.
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
                user: typeof includeUserWithoutAddress;
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

// Het type dat het resultaat van een PATCH request of de body van een POST request modelleert.
type BuildingWithoutHash = Prisma.BuildingGetPayload<{
    select: {
        id: true;
        name: true;
        ivago_id: true;
        syndicus_id: true;
        address_id: true;
        manual_id: true;
        hash: false;
        deleted: true;
    };
}>;

export class BuildingQuery extends Query<
    BuildingQueryParameters,
    BuildingWithoutHash,
    BuildingAllInfo,
    BuildingAllInfo,
    BuildingWithoutHash
> {
    endpoint = "building";
}
