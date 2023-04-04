import { UserRegion } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type UserRegionQueryParameters = {
    take: number;
    skip: number;
    user_id: number;
    region_id: number;
};

export class UserRegionQuery extends Query<
    UserRegionQueryParameters,
    UserRegion
> {
    endpoint = "user_region";
}
