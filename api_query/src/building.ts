import { Building, Image, Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { includeUserWithoutAddress } from "./include";
import { QueryError } from "./query_error";

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
    Building,
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
}
