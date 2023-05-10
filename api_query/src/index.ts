import { ActionQuery } from "./action";
import { AddressQuery } from "./address";
import { BuildingQuery } from "./building";
import { GarbageQuery } from "./garbage";
import { MailQuery } from "./mail";
import { ProgressQuery } from "./progress";
import { RegionQuery } from "./region";
import { RoundQuery } from "./round";
import { MailTemplateQuery } from "./mail_template";
import { RoundBuildingQuery } from "./round_building";
import { ScheduleQuery } from "./schedule";
import { SyndicusQuery } from "./syndicus";
import { UserQuery } from "./user";
import { UserRegionQuery } from "./user_region";
import { QueryError } from "./query_error";
import { Result, Parameter, Element } from "./query";
import { Prisma } from "@selab-2/groep-1-orm";

type AuthenticatedUser = Prisma.UserGetPayload<{
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
        hash: false;
        salt: false;
        address: true;
        syndicus: {
            select: {
                id: true;
            };
        };
    };
}>;

export {
    ActionQuery,
    AddressQuery,
    AuthenticatedUser,
    BuildingQuery,
    GarbageQuery,
    MailQuery,
    ProgressQuery,
    RegionQuery,
    RoundQuery,
    RoundBuildingQuery,
    ScheduleQuery,
    SyndicusQuery,
    UserQuery,
    UserRegionQuery,
    QueryError,
    Result,
    Parameter,
    Element,
    MailTemplateQuery,
};
