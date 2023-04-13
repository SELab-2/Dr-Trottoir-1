# Query Builder

Om te interageren met de API wordt een eenvoudige abstractie voorzien.

```typescript
// Alle studenten die zich hebben aangemeld sinds 20[README.md](README.md)20-01-01.
const users: Array<User> = new UserQuery().url({
    student: true,
    login_after: new Date("2020-01-01"),
});
```

Eender waar kan een `QueryError` error opgegooid worden. Hou hier steeds rekening mee. Deze bevat onder andere een statuscode en beschrijving van de fout.

## Installatie

We publiceren deze _query builder_ als `@selab-2/groep-1-orm` in de GitHub NPM package registry.

```shell
npm install @selab-2/groep-1-query@MAJOR.MINOR.PATCH
```

Je dient de `API_SERVER_ADDRESS` _environment variabel_ in te stellen met de URL van de server, bijvoorbeeld `http://localhost:8080/`.

## Werking

De basis wordt gevormd door de abstracte klasse `Query`.

```typescript
/**
 * Parameters: Een type die de interface van de API modeleert.
 * Result: Een type die het resultaat modeleert.
 */
export abstract class Query<Parameters, Result> {
    // Endpoint van dit model in onze API.
    abstract endpoint: string;

    // Geef de resulterende URL voor een query op basis van gegeven parameters.
    url(query: Partial<Parameters>): string;

    // Verkrijg een element per identifier.
    async getOne(id: number): Promise<Result>;

    // Verkrijg alle resultaten die voldoen aan de parameters.
    async getAll(
        query: Partial<Parameters> = {},
    ): Promise<Array<Result> | APIError>;

    // Update een element.
    async updateOne(element: Partial<Result>): Promise<Result>;

    // Verwijder een element.
    async deleteOne(
        element: Partial<Result>,
        hard = false,
    ): Promise<void>;
}
```

Stel dat we een `BuildingQuery` klasse willen implementeren die verschillende gebouwen op kan vragen. We definiëren eerst het `BuildingQueryParameters` type.

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
```

Deze komt één-op-één overeen met de `key=value`'s die verwacht worden door de API. Merk op dat we hier dus uitsluitend `snake_case` gebruiken in plaats van `camelCase`.

We erven nu van `Query` over, en hoeven uitsluitend nog de _endpoint_ van ons model op te geven.

```typescript
export class BuildingQuery extends Query<BuildingQueryParameters, Building> {
    endpoint = "building";
}
```

Dankzij de `Query::getAll` methode kunnen we onmiddelijk onze resultaten verkrijgen.

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
const userOrErr: User = new UserQuery().getOne(id);
```
