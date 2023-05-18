import {
    Progress,
    Prisma,
    ProgressImageType,
    File,
    ProgressImage,
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

export type ProgressImageNew = Pick<
    ProgressImage,
    "type" | "description" | "image_id"
>;

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
        image: ProgressImageNew,
    ): Promise<ProgressAllInfo> {
        if (Number.isNaN(id)) {
            throw new QueryError(400, "Bad Request");
        }

        const imageEndpoint = this.server + this.endpoint + "/" + id + "/image";

        return super.fetchJSON(imageEndpoint, "POST", {
            image_id: image.image_id,
            type: image.type,
            description: image.description,
        } satisfies ProgressImageNew);
    }

    /**
     * Update een specifieke afbeelding via HTTP PATCH.
     * @throws QueryError
     */
    async updateImage(
        id: number,
        image: ProgressImageNew,
    ): Promise<ProgressAllInfo> {
        const imageEndpoint =
            this.server + this.endpoint + "/" + id + "/image/" + image.image_id;

        return super.fetchJSON(imageEndpoint, "PATCH", {
            type: image.type,
            description: image.description,
        });
    }

    /**
     * Verwijder een specifieke afbeelding via HTTP DELETE
     * @throws QueryError
     */
    async deleteImage(
        id: number,
        image: File,
        hard = false,
    ): Promise<ProgressAllInfo> {
        const imageEndpoint =
            this.server + this.endpoint + "/" + id + "/image/" + image.id;

        return super.fetchJSON(imageEndpoint, "DELETE", { hardDelete: hard });
    }
}
