import { User } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type UserQueryParameters = {
    take: number;
    skip: number;
    student: boolean;
    super_student: boolean;
    admin: boolean;
    login_before: Date;
    login_after: Date;
    added_before: Date;
    added_after: Date;
    name: string;
};

export class UserQuery extends Query<UserQueryParameters, User> {
    endpoint = "user";
}
