import {
    Progress,
    Prisma,
    ProgressImageType,
    File,
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
        image: File,
        element: { description: string; type: ProgressImageType },
    ): Promise<ProgressAllInfo> {
        if (Number.isNaN(id)) {
            throw new QueryError(400, "Bad Request");
        }

        const imageEndpoint = this.server + this.endpoint + "/" + id + "/image";

        return super.fetchJSON(imageEndpoint, "POST", {
            ...element,
            image_id: image.id,
        });
    }

    /**
     * Update een specifieke afbeelding via HTTP PATCH.
     * @throws QueryError
     */
    async updateImage(
        id: number,
        image: File,
        element: Partial<{ description: string; type: ProgressImageType }>,
    ): Promise<ProgressAllInfo> {
        const imageEndpoint =
            this.server + this.endpoint + "/" + id + "/image/" + image.id;

        return super.fetchJSON(imageEndpoint, "PATCH", element);
    }

    /**
     * Verwijder een specifieke afbeelding via HTTP DELETE
     * @throws QueryError
     */
    async deleteImage(id: number, image: File, hard = false): Promise<void> {
        const imageEndpoint =
            this.server + this.endpoint + "/" + id + "/image/" + image.id;

        return super.fetchJSON(imageEndpoint, "DELETE", { hardDelete: hard });
    }
}
