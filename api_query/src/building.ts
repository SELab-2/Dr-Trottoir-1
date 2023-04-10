import { Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";

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

const includeUser = {
    select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        last_login: true,
        date_added: true,
        phone: true,
        address_id: true,
        student: true,
        super_student: true,
        admin: true,
        deleted: true,
        hash: false,
        salt: false,
    },
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
