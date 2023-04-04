import { UserRegion } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type UserRegionQueryParameters = {
  id: number,
};

export class UserRegionQuery extends Query<UserRegionQueryParameters, UserRegion> {
  endpoint = "user_region";
}
