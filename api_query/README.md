# Query Builder

Om te interageren met de API wordt een eenvoudige abstractie voorzien.

```typescript
// Alle studenten die zich hebben aangemeld sinds 2020-01-01.
const users: Array<User | APIError> = new UserQuery().url({
    student: true,
    login_after: new Date("2020-01-01"),
});
```

## Installatie

We publiceren deze _query builder_ als `@selab-2/groep-1-orm` in de GitHub NPM package registry.

```shell
npm install @selab-2/groep-1-query@MAJOR.MINOR.PATCH
```

Je dient de `API_SERVER_ADDRESS` _environment variabel_ in te stellen met de URL van de server, bijvoorbeeld `http://localhost:8080/`.

## Werking

De basis wordt gevormd door de abstracte klasse `Query`.

```typescript
import { QueryError } from "./query_error";

/**
 * Parameters: Een type die de interface van de API modelleert.
 * PostParameters: Een type die de body van een POST request modelleert.
 * ResultGet: Een type die het resultaat van een GET request modelleert.
 * ResultPost: Een type die het resultaat van een POST request modelleert.
 * ResultPatch: Een type die het resultaat van een PATCH request modelleert.
 */
export abstract class Query<
    Parameters,
    PostParameters,
    ResultGet,
    ResultPost,
    ResultPatch,
> {
    // Endpoint van dit model in onze API.
    abstract endpoint: string;

    // Geef de resulterende URL voor een query op basis van gegeven parameters.
    url(query: Partial<Parameters>): string;

    // Verkrijg een element per identifier.
    async getOne(id: number): Promise<ResultGet | QueryError>;

    // Verkrijg alle resultaten die voldoen aan de parameters.
    async getAll(
        query: Partial<Parameters> = {},
    ): Promise<Array<ResultGet> | QueryError>;

    // Voeg een nieuw element toe.
    async addOne(
        element: Partial<PostParameters>,
    ): Promise<ResultPost | QueryError>;

    // Update een element.
    async updateOne(
        element: Partial<ResultPatch>,
    ): Promise<ResultPatch | QueryError>;

    // Verwijder een element.
    async deleteOne(
        element: Partial<ResultGet>,
        hard = false,
    ): Promise<void | QueryError>;
}
```

Stel dat we een `BuildingQuery` klasse willen implementeren die verschillende gebouwen op kan vragen. We definiëren eerst de types `BuildingQueryParameters`, `BuildingAllInfo` en `BuildingWithoutHash` die nodig zijn om van `Query` te kunnen erven.

```typescript
export type BuildingQueryParameters = {
    take: number;
    skip: number;
    name: string;
    ivage_id: string;
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

type BuildingWithoutHash = Prisma.BuildingGetPayload<{
    select: {
        id: true;
        name: true;
        ivago_id: true;
        syndicus_id: true;
        address_id: true;
        manual_id: true;
        hash: false;
        deleted: true;
    };
}>;
```

Deze komt één-op-één overeen met de `key=value`'s die verwacht worden door de API. Merk op dat we hier dus uitsluitend `snake_case` gebruiken in plaats van `camelCase`.

We erven nu van `Query` over, en hoeven uitsluitend nog de _endpoint_ van ons model op te geven.

```typescript
export class BuildingQuery extends Query<
    BuildingQueryParameters,
    BuildingWithoutHash,
    BuildingAllInfo,
    BuildingAllInfo,
    BuildingWithoutHash
> {
    endpoint = "building";
}
```

Dankzij de `Query::execute` methode kunnen we onmiddelijk onze resultaten verkrijgen.

```typescript
const usersOrErr: User[] | APIError = new UserQuery().getAll({
    take: 0,
    skip: 5,
    added_after: date,
    added_before: date,
    admin: true,
    student: true,
    super_student: true,
    login_before: date,
    name: "Bob",
    login_after: date,
});
```

Heb je reeds een identifier van een resource, dan kan je deze ook onmiddelijk opvragen.

```typescript
const userOrErr: User | APIError = new UserQuery().getOne(id);
```
