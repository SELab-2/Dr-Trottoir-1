import { Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { includeUserWithoutAddress } from "./include";

export type RegionQueryParameters = {
    take: number;
    skip: number;
    id: number;
    name: string;
    user_id: number;
};

type RegionWithUsers = Prisma.RegionGetPayload<{
    include: {
        users: {
            include: {
                user: typeof includeUserWithoutAddress;
            };
        };
    };
}>;

export class RegionQuery extends Query<RegionQueryParameters, RegionWithUsers> {
    endpoint = "region";
}
