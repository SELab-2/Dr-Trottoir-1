import { Prisma, File } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { includeUserWithoutAddress } from "./include";
import { QueryError } from "./query_error";
import { ProgressQuery } from "./progress";

export type BuildingQueryParameters = {
    take: number;
    skip: number;
    name: string;
    ivago_id: string;
    description: string;
    syndicus_id: number;
    deleted: boolean;
    sort: string[];
    ord: Array<"asc" | "desc">;
};

// Het type dat de body van een POST en PATCH request modelleert.
type Element = Prisma.BuildingGetPayload<{
    select: {
        id: true;
        name: true;
        ivago_id: true;
        description: true;
        expected_time: true;
        deleted: true;
        hash: boolean;
        address: true;
    };
}>;

type BuildingAllInfo = Prisma.BuildingGetPayload<{
    select: {
        id: true;
        name: true;
        ivago_id: true;
        description: true;
        expected_time: true;
        deleted: true;
        hash: false;
        address: true;
        syndicus: {
            include: {
                user: typeof includeUserWithoutAddress;
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

type BuildingAnalytics = {
    name: string;
    expected: number | null;
    total: number;
};

export class BuildingQuery extends Query<
    BuildingQueryParameters,
    Element,
    BuildingAllInfo
> {
    endpoint = "building";

    /**
     * Voeg een nieuwe afbeelding toe via HTTP POST.
     * @throws QueryError
     */
    async createImage(id: number, element: File): Promise<BuildingAllInfo> {
        if (Number.isNaN(id)) {
            throw new QueryError(400, "Bad Request");
        }

        const imageEndpoint = this.server + this.endpoint + "/" + id + "/image";

        return this.fetchJSON(imageEndpoint, "POST", {
            image: element.id,
        });
    }

    /**
     * Verwijder een specifieke afbeelding via HTTP DELETE
     * @throws QueryError
     */
    async deleteImage(id: number, file: File, hard = false): Promise<void> {
        const imageEndpoint =
            this.server + this.endpoint + "/" + id + "/image/" + file.id;

        return this.fetchJSON(imageEndpoint, "DELETE", { hardDelete: hard });
    }

    async getAnalytics(
        startdate: Date,
        enddate: Date,
    ): Promise<Array<BuildingAnalytics>> {
        const analytics = [];
        const buildings: Array<BuildingAllInfo> = await this.fetchJSON(
            this.server + this.endpoint,
        );

        for (const building of buildings) {
            // bereken de totaal gespendeerde tijd
            let time = 0;

            const parameters = {
                arrived_after: startdate,
                left_before: enddate,
                building: building.id,
            };

            const progresses = await new ProgressQuery().getAll(parameters);
            for (const progress of progresses) {
                if (progress.arrival !== null && progress.departure != null) {
                    const departure = new Date(progress.departure);
                    const arrival = new Date(progress.arrival);
                    const hours = departure.getHours() - arrival.getHours();
                    const minutes =
                        departure.getMinutes() - arrival.getMinutes();

                    time += 60 * hours + minutes;
                }
            }

            const analysis = {
                name: building.name,
                expected: building.expected_time,
                total: time,
            };
            analytics.push(analysis);
        }

        return analytics;
    }
}
