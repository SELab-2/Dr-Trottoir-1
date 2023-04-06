import { APIError } from "./api_error";

/**
 * Abstractie overheen onze API voor client side queries uit te voere.
 *
 * Parameters: Een type die de interface van de API modeleert.
 * Result: Een type die het resultaat modeleert.
 */
export abstract class Query<Parameters, Result> {
    // Endpoint van dit model in onze API.
    abstract endpoint: string;
    server = process.env["API_SERVER_ADDRESS"] ?? process.env["VUE_APP_API_SERVER_ADDRESS"] ?? "";

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

    // Verkrijg een element per identifier.
    async executeOne(id: number): Promise<Result | APIError> {
        if (Number.isNaN(id)) {
            return { code: 400, message: "Bad Request" };
        }

        try {
            const url = this.server + this.endpoint + "/" + id;
            const res = await fetch(url);
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

    // Verkrijg alle resultaten die voldoen aan de parameters.
    async execute(
        query: Partial<Parameters>,
    ): Promise<Array<Result> | APIError> {
        try {
            const res = await fetch(this.url(query));
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
}
