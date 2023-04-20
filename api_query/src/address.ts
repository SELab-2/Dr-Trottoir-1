import { Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type AddressQueryParameters = {
    take: number;
    skip: number;
    street: string;
    number: number;
    city: string;
    zip_code: number;
    sort: string[];
    ord: Array<"asc" | "desc">;
};

// Het type dat de body van een POST en PATCH request modelleert.
type Element = {
    id: number;
    street: string;
    number: number;
    city: string;
    zip_code: number;
    latitude: number;
    longitude: number;
};

type AddressAllInfo = Prisma.AddressGetPayload<{
    select: {
        id: true;
        street: true;
        number: true;
        city: true;
        zip_code: true;
        latitude: true;
        longitude: true;
    };
}>;

export class AddressQuery extends Query<
    AddressQueryParameters,
    Element,
    AddressAllInfo
> {
    endpoint = "address";
}