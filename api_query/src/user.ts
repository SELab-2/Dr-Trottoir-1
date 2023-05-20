import { Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { BuildingQuery } from "./building";
import { ProgressQuery } from "./progress";
import { RoundQuery } from "./round";
import { ScheduleQuery } from "./schedule";

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

// Het type dat het resultaat modelleert wanneer de statistieken van de studenten per gebouw worden opgevraagd
type BuildingAnalytics = {
    student: string;
    email: string;
    building: string;
    time: number;
    average: number;
};

// Het type dat het resultaat modelleert wanneer de statistieken van de studenten per ronde worden opgevraagd
type RoundAnalytics = {
    student: string;
    email: string;
    round: string;
    time: number;
    average: number;
};

// Het type dat het resultaat modelleert wanneer het aantal gewerkte minuten van de studenten worden opgevraagd
// tussen een start- en einddatum
export type UserAnalytics = {
    student: number;
    email: string;
    time: number;
    average: number;
};

function getAverageProgressTime(progresses: Array<any>) {
    let time = 0;
    let total = 0;
    for (const progress of progresses) {
        if (progress.arrival && progress.departure) {
            const departure = new Date(progress.departure);
            const arrival = new Date(progress.arrival);
            const hours = departure.getHours() - arrival.getHours();
            const minutes = departure.getMinutes() - arrival.getMinutes();

            time += 60 * hours + minutes;
            total++;
        }
    }
    if (total != 0) {
        time /= total;
    }
    return time;
}

function getAverageScheduleTime(schedules: Array<any>) {
    let time = 0;
    let total = 0;
    for (const schedule of schedules) {
        if (schedule.start && schedule.end) {
            const end = new Date(schedule.end);
            const start = new Date(schedule.start);
            const hours = end.getHours() - start.getHours();
            const minutes = end.getMinutes() - start.getMinutes();

            time += 60 * hours + minutes;
            total++;
        }
    }
    if (total > 0) {
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

    async getBuildingAnalytics(
        startdate: Date,
        enddate: Date,
    ): Promise<Array<BuildingAnalytics>> {
        const analytics = [];
        const buildings = await new BuildingQuery().getAll();

        // bereken de gemiddelde tijd per gebouw
        const averages: { [name: string]: number } = {};
        for (const building of buildings) {
            const progresses = await new ProgressQuery().getAll({
                building: building.id,
                arrived_after: startdate,
                left_before: enddate,
            });

            averages[building.name] = getAverageProgressTime(progresses);
        }

        // bereken de gemiddelde tijd per student per gebouw
        const users = await this.getAll({
            student: true,
        });
        for (const user of users) {
            for (const building of buildings) {
                const progresses = await new ProgressQuery().getAll({
                    user: user.id,
                    building: building.id,
                    arrived_after: startdate,
                    left_before: enddate,
                });

                const time = getAverageProgressTime(progresses);

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

    async getRoundAnalytics(
        startdate: Date,
        enddate: Date,
    ): Promise<Array<RoundAnalytics>> {
        const analytics = [];
        const rounds = await new RoundQuery().getAll();

        // bepaal gemiddelde gespendeerde tijd per ronde
        const averages: { [name: string]: number } = {};
        for (const round of rounds) {
            const schedules = await new ScheduleQuery().getAll({
                round_id: round.id,
                after: startdate,
                before: enddate,
            });

            averages[round.name] = getAverageScheduleTime(schedules);
        }

        // bepaal gemiddelde gespendeerde tijd per student per ronde
        const users = await this.getAll({
            student: true,
        });

        for (const user of users) {
            for (const round of rounds) {
                const schedules = await new ScheduleQuery().getAll({
                    user_id: user.id,
                    round_id: round.id,
                    after: startdate,
                    before: enddate,
                });

                const time = getAverageScheduleTime(schedules);

                if (time > 0) {
                    analytics.push({
                        student: user.first_name + " " + user.last_name,
                        email: user.email,
                        round: round.name,
                        time: time,
                        average: averages[round.name],
                    });
                }
            }
        }

        return analytics;
    }

    // Geef het aantal gewerkte uren van alle studenten weer tussen een start- en einddatum
    // Enkel de studenten die effectief gewerkt hebben, worden getoond
    async getAnalytics(
        startdate: Date,
        enddate: Date,
    ): Promise<Array<UserAnalytics>> {
        const analytics = [];
        const users = await this.getAll({
            student: true,
        });

        let total_time = 0;
        let worked = 0;
        for (const user of users) {
            const schedules = await new ScheduleQuery().getAll({
                user_id: user.id,
                after: startdate,
                before: enddate,
            });

            let time = 0;
            for (const schedule of schedules) {
                if (schedule.start && schedule.end) {
                    const end = new Date(schedule.end);
                    const start = new Date(schedule.start);
                    const hours = end.getHours() - start.getHours();
                    const minutes = end.getMinutes() - start.getMinutes();

                    time += 60 * hours + minutes;
                }
            }

            if (time > 0) {
                total_time += time;
                worked++;
                analytics.push({
                    student: user.id,
                    email: user.email,
                    time: time,
                    average: 0,
                });
            }
        }

        const average = total_time / worked;
        for (const analysis of analytics) {
            analysis.average = average;
        }

        return analytics;
    }
}
