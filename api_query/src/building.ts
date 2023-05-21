import { Prisma, File, Building } from "@selab-2/groep-1-orm";
import { Query, Result } from "./query";
import { includeUserWithoutAddress } from "./include";
import { QueryError } from "./query_error";
import { ProgressQuery } from "./progress";
import { FileQuery } from "./file";

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
        building: { id: number },
        elementId: string,
    ): Promise<BuildingAllInfo> {
        const file = await new FileQuery().createOne(elementId);

        if (Number.isNaN(building.id)) {
            throw new QueryError(400, "Bad Request");
        }

        const imageEndpoint =
            this.server + this.endpoint + "/" + building.id + "/image";

        return this.fetchJSON(imageEndpoint, "POST", {
            image: file.id,
        });
    }

    /**
     * Verwijder een specifieke afbeelding via HTTP DELETE
     * @throws QueryError
     */
    async deleteImage(
        id: number,
        file: { id: number },
        hard = false,
    ): Promise<BuildingAllInfo> {
        const imageEndpoint =
            this.server + this.endpoint + "/" + id + "/image/" + file.id;

        return this.fetchJSON(imageEndpoint, "DELETE", { hardDelete: hard });
    }

    async totalTimeSpent(
        building: number,
        startDate: Date,
        endDate: Date,
    ): Promise<number> {
        let time = 0;

        const progressItems = await new ProgressQuery().getAll({
            arrived_after: startDate,
            left_before: endDate,
            building,
        });

        for (const progress of progressItems) {
            if (progress.arrival !== null && progress.departure != null) {
                const departure = new Date(progress.departure);
                const arrival = new Date(progress.arrival);
                time +=
                    (departure.getTime() - arrival.getTime()) /
                    (1000 * 60 * 60);
            }
        }

        return time;
    }
}
