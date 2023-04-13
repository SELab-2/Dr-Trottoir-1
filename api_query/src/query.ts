import { QueryError } from "./query_error";

/**
 * Abstractie overheen onze API voor client side queries uit te voeren.
 *
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
     * @param body De velden in de databank met hun nieuwe waarde.
     * @throwd QueryError
     */
    private async fetchJSON(
        url: string,
        method = "GET",
        body = {},
    ): Promise<any | null> {
        let res: Response | null = null;
        let json: any = null;

        const options: {
            method: string;
            headers: HeadersInit;
            credentials: RequestCredentials;
            redirect: RequestRedirect;
            body?: BodyInit;
        } = {
            method: method,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            redirect: "error",
            body: JSON.stringify(body),
        };
        if (method === "GET") {
            delete options.body;
        }

        try {
            res = await fetch(url, options);
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
     * Vraag een element op met een specifieke identifier. Indien een HTTP-
     * error voorvalt, wordt deze opgevangen en teruggegeven
     * @throws QueryError
     */
    async getOne(id: number): Promise<ResultGet> {
        if (Number.isNaN(id)) {
            throw new QueryError(400, "Bad Request");
        }

        return this.fetchJSON(this.server + this.endpoint + "/" + id);
    }

    /**
     * Vraag alle elementen op die voldoen aan de gegeven parameters. Indien een
     * HTTP-error voorvalt, wordt deze opgevangen en teruggegeven.
     * @throws QueryError
     */
    async getAll(query: Partial<Parameters> = {}): Promise<Array<ResultGet>> {
        return this.fetchJSON(this.url(query));
    }

    /**
     * Voeg een nieuw element toe via HTTP POST.
     * @throws QueryError
     */
    async addOne(element: Partial<PostParameters>): Promise<ResultPost> {
        return this.fetchJSON(this.server + this.endpoint, "POST", element);
    }

    /**
     * Update een specifiek element via HTTP PATCH.
     * @throws QueryError
     */
    async updateOne(element: Partial<ResultPatch>): Promise<ResultPatch> {
        const index = Object.keys(element).indexOf("id");

        if (index === -1) {
            throw new QueryError(400, "Bad Request");
        }

        const id = Object.entries(element)[index][1];
        const url = this.server + this.endpoint + "/" + id;

        if (Number.isNaN(id)) {
            throw new QueryError(400, "Bad Request");
        }

        return this.fetchJSON(url, "PATCH", element);
    }

    /**
     * Verwijder een element via HTTP DELETE. Indien een "hard delete"
     * uitgevoerd moet worden, dient dit expliciet opgegeven te worden als
     * argument.
     * @throws QueryError
     */
    async deleteOne(element: Partial<ResultGet>, hard = false): Promise<void> {
        const index = Object.keys(element).indexOf("id");

        if (index === -1) {
            throw new QueryError(400, "Bad Request");
        }

        const entries = Object.entries(element);
        const id = entries[index][1];
        const url = this.server + this.endpoint + "/" + id;

        if (Number.isNaN(id)) {
            throw new QueryError(400, "Bad Request");
        }

        return this.fetchJSON(url, "DELETE", { hardDelete: hard });
    }
}
