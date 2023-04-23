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

// Het type dat de body van een POST en PATCH request modelleert.
type Element = Prisma.UserGetPayload<{
    select: {
        id: true;
        email: true;
        first_name: true;
        last_name: true;
        date_added: true;
        last_login: true;
        phone: true;
        address_id: true;
        student: true;
        super_student: true;
        admin: true;
        deleted: true;
        hash: false;
        salt: false;
        password: string;
        address: true;
    };
}>;

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

export class UserQuery extends Query<
    UserQueryParameters,
    Element,
    UserAllInfo
> {
    endpoint = "user";
}
