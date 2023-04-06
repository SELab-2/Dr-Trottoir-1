import { APIError } from "./api_error";

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

    // Geef de resulterende URL voor een query op basis van gegeven parameters.
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
     * error voorvalt, wordt deze opgevangen en teruggegeven.
     */
    async getOne(id: number): Promise<Result | APIError> {
        if (Number.isNaN(id)) {
            return { code: 400, message: "Bad Request" };
        }

        try {
            const url = this.server + this.endpoint + "/" + id;

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
                redirect: "error",
            });

            const json = await res.json();

            if (!res.ok) {
                return {
                    code: res.status,
                    message: json["message"] ?? "Unknown",
                };
            }

            return json;
        } catch (e) {
            return { code: 503, message: "Service Unavailable" };
        }
    }

    /**
     * Vraag alle elementen op die voldoen aan de gegeven parameters. Indien een
     * HTTP error voorvalt, wordt deze opgevangen en teruggegeven.
     */
    async getAll(
        query: Partial<Parameters> = {},
    ): Promise<Array<Result> | APIError> {
        try {
            const res = await fetch(this.url(query), {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
                redirect: "error",
            });

            const json = await res.json();

            if (!res.ok) {
                return {
                    code: res.status,
                    message: json["message"] ?? "Unknown",
                };
            }

            return json;
        } catch (e) {
            return { code: 503, message: "Service Unavailable" };
        }
    }

    /**
     * Update een specifiek element via HTTP PATCH.
     */
    async updateOne(element: Partial<Result>): Promise<Result | APIError> {
        throw new Error("Not Implemented");
    }

    /**
     * Verwijder een element via HTTP DELETE. Indien een "hard delete"
     * uitgevoerd te worden dient dit expliciet opgegeven te worden als
     * argument.
     */
    async deleteOne(
        element: Partial<Result>,
        hard = false,
    ): Promise<void | APIError> {
        throw new Error("Not Implemented");
    }
}
