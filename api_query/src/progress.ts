import {
    Progress,
    Prisma,
    FileLocation,
    ProgressImageType,
} from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { includeUserWithoutAddress, includeBuilding } from "./include";
import { QueryError } from "./query_error";

export type ProgressQueryParameters = {
    take: number;
    skip: number;
    deleted: boolean;
    report: string;
    arrived_before: Date;
    arrived_after: Date;
    left_before: Date;
    left_after: Date;
    building: number;
    schedule: number;
    round: number;
    user: number;
};

type ProgressAllInfo = Prisma.ProgressGetPayload<{
    include: {
        building: typeof includeBuilding;
        schedule: {
            include: {
                round: true;
                user: typeof includeUserWithoutAddress;
            };
        };
        images: {
            include: {
                image: true;
            };
        };
    };
}>;

type ProgressImage = {
    time: Date;
    location: FileLocation;
    path: string;
    user_id: number;
    type: ProgressImageType;
    description: string;
};

export class ProgressQuery extends Query<
    ProgressQueryParameters,
    Progress,
    ProgressAllInfo
> {
    endpoint = "progress";

    /**
     * Voeg een nieuwe afbeelding toe via HTTP POST.
     * @throws QueryErrror
     */
    async createImage(
        id: number,
        element: Partial<ProgressImage>,
    ): Promise<ProgressAllInfo> {
        if (Number.isNaN(id)) {
            throw new QueryError(400, "Bad Request");
        }

        const imageEndpoint = this.server + this.endpoint + "/" + id + "/image";

        return super.fetchJSON(imageEndpoint, "POST", element);
    }

    /**
     * Update een specifieke afbeelding via HTTP PATCH.
     * @throws QueryError
     */
    async updateImage(
        id: number,
        image_id: number,
        element: Partial<ProgressImage>,
    ): Promise<ProgressAllInfo> {
        if (Number.isNaN(id) || Number.isNaN(image_id)) {
            throw new QueryError(400, "Bad Request");
        }

        const imageEndpoint =
            this.server + this.endpoint + "/" + id + "/image/" + image_id;

        return super.fetchJSON(imageEndpoint, "PATCH", element);
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

        return super.fetchJSON(imageEndpoint, "DELETE", { hardDelete: hard });
    }
}
