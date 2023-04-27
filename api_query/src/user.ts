import {Prisma} from "@selab-2/groep-1-orm";
import {Query} from "./query";
import {BuildingQuery} from "./building";
import {ProgressQuery} from "./progress";

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

type BuildingAnalytics = {
    student: string;
    email: string;
    building: string;
    time: number;
    average: number;
}

function getAverageTime(progresses: Array<any>) {
    let time = 0;
    let total = 0;
    for (let progress of progresses) {
        if (progress.arrival !== null && progress.departure !== null) {
            const departure = new Date(progress.departure);
            const arrival = new Date(progress.arrival);
            const hours = departure.getHours() - arrival.getHours();
            const minutes = departure.getMinutes() - arrival.getMinutes();

            time += 60 * hours + minutes;
            total ++;
        }
    }
    if (total != 0) {
        time /= total;
    }
    return time;
}

export class UserQuery extends Query<
    UserQueryParameters,
    Element,
    UserAllInfo
> {
    endpoint = "user";

    async getBuildingAnalytics(starttime: Date, endtime: Date): Promise<Array<BuildingAnalytics>> {
        const analytics = [];
        const buildings = await new BuildingQuery().getAll();

        // bereken de gemiddelde tijd per gebouw
        let averages: {[name: string]: number} = {};
        for (let building of buildings) {
            const progresses = await new ProgressQuery().getAll({
                building: building.id,
                arrived_after: starttime,
                left_before: endtime,
            });

            averages[building.name] = getAverageTime(progresses);
        }

        // bereken de gemiddelde tijd per student per gebouw
        const users = await this.getAll({
            student: true,
        });
        for (let user of users) {
            for (let building of buildings) {
                const progresses = await new ProgressQuery().getAll({
                    user: user.id,
                    building: building.id,
                    arrived_after: starttime,
                    left_before: endtime,
                });

                const time = getAverageTime(progresses);

                if (time > 0) {
                    analytics.push({
                        student: user.first_name + " " + user.last_name,
                        email: user.email,
                        building: building.name,
                        time: time,
                        average: averages[building.name],
                    });
                }
            }
        }

        return analytics;
    }
}
