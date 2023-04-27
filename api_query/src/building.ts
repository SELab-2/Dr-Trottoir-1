import { Image, Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { includeUserWithoutAddress } from "./include";
import { QueryError } from "./query_error";
import { ProgressQuery } from "./progress";

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

// Het type dat de body van een POST en PATCH request modelleert.
type Element = Prisma.BuildingGetPayload<{
    select: {
        id: true;
        name: true;
        ivago_id: true;
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

type BuildingAnalysis = {
    name: string;
    expected: number | null;
    average: number;
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
    async createImage(
        id: number,
        element: Partial<Image>,
    ): Promise<BuildingAllInfo> {
        if (Number.isNaN(id)) {
            throw new QueryError(400, "Bad Request");
        }

        const imageEndpoint = this.server + this.endpoint + "/" + id + "/image";

        return this.fetchJSON(imageEndpoint, "POST", element);
    }

    /**
     * Verwijder een specifieke afbeelding via HTTP DELETE
     * @throws QueryError
     */
    async deleteImage(
        id: number,
        image_id: number,
        hard = false,
    ): Promise<void> {
        if (Number.isNaN(id) || Number.isNaN(image_id)) {
            throw new QueryError(400, "Bad Request");
        }

        const imageEndpoint =
            this.server + this.endpoint + "/" + id + "/image/" + image_id;

        return this.fetchJSON(imageEndpoint, "DELETE", { hardDelete: hard });
    }

    async getAnalytics(
        starttime: Date,
        endtime: Date,
    ): Promise<Array<BuildingAnalysis>> {
        const analytics = [];
        const buildings: Array<BuildingAllInfo> = await this.fetchJSON(
            this.server + this.endpoint,
        );

        for (let building of buildings) {
            // bereken de totaal gespendeerde tijd
            let time = 0;

            const parameters = {
                arrived_after: starttime,
                left_before: endtime,
                building: building.id,
            };

            const progresses = await new ProgressQuery().getAll(parameters);
            for (let progress of progresses) {
                if (progress.arrival !== null && progress.departure != null) {
                    const departure = new Date(progress.departure);
                    const arrival = new Date(progress.arrival);
                    const hours = departure.getHours() - arrival.getHours();
                    const minutes = departure.getMinutes() - arrival.getMinutes();

                    time += 60 * hours + minutes;
                }
            }

            const analysis = {
                name: building.name,
                expected: building.expected_time,
                average: time,
            };
            analytics.push(analysis);
        }

        return analytics;
    }
}
