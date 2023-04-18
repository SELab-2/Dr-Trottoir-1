import { Prisma } from "@selab-2/groep-1-orm";
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

type UserAllInfo = Prisma.UserGetPayload<{
    select: {
        id: true;
        email: true;
        first_name: true;
        last_name: true;
        last_login: true;
        date_added: true;
        phone: true;
        address_id: true;
        student: true;
        super_student: true;
        admin: true;
        deleted: true;
        hash: false;
        salt: false;
        address: true;
        regions: {
            include: {
                region: true;
            };
        };
    };
}>;

export class UserQuery extends Query<UserQueryParameters, UserAllInfo> {
    endpoint = "user";
}
