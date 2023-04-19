import { FileLocation, Prisma, ProgressImageType } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { includeBuilding } from "./include";

export type ImageQueryParameters = {
    take: number;
    skip: number;
    before: Date;
    after: Date;
    path: string;
    user_id: number;
    building_id: number;
    progress_id: number;
    sort: string[];
    ord: Array<"asc" | "desc">;
};

// Het type dat de body van een POST en PATCH request modelleert.
type Element = {
    id: number;
    time: Date;
    location: FileLocation;
    path: string;
    user_id: number;
    building_id: number;
    image_id: number;
    type: ProgressImageType;
    description: string;
    progress_id: number;
    deleted: boolean;
};

type ImageAllInfo = Prisma.ImageGetPayload<{
    include: {
        buildings: {
            include: {
                building: typeof includeBuilding;
            };
        };
        progress: {
            include: {
                progress: true;
            };
        };
    };
}>;

export class ImageQuery extends Query<
    ImageQueryParameters,
    Element,
    ImageAllInfo
> {
    endpoint = "image";
}
