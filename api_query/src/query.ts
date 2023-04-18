import { QueryError } from "./query_error";

/**
 * Abstractie overheen onze API voor client side queries uit te voeren.
 *
 * Parameters: Een type die de interface van de API modeleert.
 * Result: Een type die het resultaat modeleert.
 */
export abstract class Query<Parameters, Result> {
    abstract endpoint: string;
    server =
        process.env.API_SERVER_ADDRESS ??
        process.env.VUE_APP_API_SERVER_ADDRESS ??
        "";

    /**
     * Convenience function die een request maakt en het resultaat als JSON
     * terug geeft.
     * @param url Waarheen de request gestuurd wordt.
     * @param method "GET", "POST", "PATCH", "DELETE", etc.
     * @throwd QueryError
     */
    private async fetchJSON(url: string, method = "GET"): Promise<any | null> {
        let res: Response | null = null;
        let json: any = null;

        try {
            res = await fetch(url, {
                method: method,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
                redirect: "error",
            });
        } catch (e) {
            throw new QueryError(503, "Service Unavailable");
        }

        try {
            json = await res.json();
        } catch (e) {
            throw new QueryError(500, "Internal Server Error");
        }

        if (!res.ok) {
            throw new QueryError(res.status, json["message"] ?? "Unknown");
        }

        return json;
    }

    /**
     * Bepaal de URL op basis van de gegeven parameters.
     */
    url(query: Partial<Parameters>): string {
        let url = this.server + this.endpoint + "?";

        for (const [key, value] of Object.entries(query)) {
            if (value instanceof Date) {
                url += `${key}=${value.toISOString()}&`;
            } else if (value instanceof Array) {
                url += `${key}=${value.join(",")}&`;
            } else {
                url += `${key}=${value}&`;
            }
        }

        return url;
    }

    /**
     * Vraag een element op met een specifieke identifier. Indien een een HTTP
     * error voorvalt, wordt deze opgevangen en teruggegeven
     * @throws QueryError
     */
    async getOne(id: number): Promise<Result> {
        if (Number.isNaN(id)) {
            throw new QueryError(400, "Bad Request");
        }

        return this.fetchJSON(this.server + this.endpoint + "/" + id);
    }

    /**
     * Vraag alle elementen op die voldoen aan de gegeven parameters. Indien een
     * HTTP error voorvalt, wordt deze opgevangen en teruggegeven.
     * @throws QueryError
     */
    async getAll(query: Partial<Parameters> = {}): Promise<Array<Result>> {
        return this.fetchJSON(this.url(query));
    }

    /**
     * Update een specifiek element via HTTP PATCH.
     * @throws QueryError
     */
    async updateOne(element: Partial<Result>): Promise<Result> {
        throw new Error("Not Implemented");
    }

    /**
     * Verwijder een element via HTTP DELETE. Indien een "hard delete"
     * uitgevoerd te worden dient dit expliciet opgegeven te worden als
     * argument.
     * @throws QueryError
     */
    async deleteOne(element: Partial<Result>, hard = false): Promise<void> {
        throw new Error("Not Implemented");
    }
}

/**
 * Infer the parameter type of Query object.
 */
export type Parameter<ConcreteQuery> = ConcreteQuery extends Query<
    infer X,
    infer Y
>
    ? Y
    : never;

/**
 * Infer the return type of Query object.
 */
export type Result<ConcreteQuery> = ConcreteQuery extends Query<
    infer X,
    infer Y
>
    ? Y
    : never;
