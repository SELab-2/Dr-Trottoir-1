import { UserRegion, Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { includeUserWithAddress } from "./include";

export type UserRegionQueryParameters = {
    take: number;
    skip: number;
    user_id: number;
    region_id: number;
};

type UserRegionAllInfo = Prisma.UserRegionGetPayload<{
    include: {
        user: typeof includeUserWithAddress;
        region: true;
    };
}>;

export class UserRegionQuery extends Query<
    UserRegionQueryParameters,
    UserRegion,
    UserRegionAllInfo
> {
    endpoint = "user_region";
}
