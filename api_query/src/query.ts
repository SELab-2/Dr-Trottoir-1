import { APIError } from "./api_error";

export abstract class Query<Parameters, Result> {
    abstract endpoint: string;

    url(query: Partial<Parameters>): string {
        let url = "/" + this.endpoint + "?";

        for (const [key, value] of Object.entries(query)) {
            if (value instanceof Date) {
                url += `${key}=${value.toISOString()}`;
            } else {
                url += `${key}=${value}&`;
            }
        }

        return url;
    }

    async executeOne(id: number): Promise<Result | APIError> {
        if (Number.isNaN(id)) {
            throw new Error("Invalid Query");
        }

        const url = "/" + this.endpoint + "/" + id;
        const res = await fetch(url);
        const json = await res.json();

        if (!res.ok) {
            return {
                code: res.status,
                message: json["message"] ?? "Unknown",
            } satisfies APIError;
        }

        return json;
    }

    async execute(
        query: Partial<Parameters>,
    ): Promise<Array<Result> | APIError> {
        const res = await fetch(this.url(query));
        const json = await res.json();

        if (!res.ok) {
            return {
                code: res.status,
                message: json["message"] ?? "Unknown",
            } satisfies APIError;
        }

        return json;
    }
}
