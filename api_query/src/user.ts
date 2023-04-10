import { User } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type UserQueryParameters = {
    take: number;
    skip: number;
    student: boolean;
    super_student: boolean;
    admin: boolean;
    deleted: boolean;
    login_before: Date;
    login_after: Date;
    added_before: Date;
    added_after: Date;
    name: string;
    region_id: number;
    sort: string[];
    ord: Array<"asc" | "desc">;
};

export class UserQuery extends Query<UserQueryParameters, User> {
    endpoint = "user";
}
