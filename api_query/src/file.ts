import { QueryError } from "./query_error";
import { File } from "@selab-2/groep-1-orm";

export class FileQuery {
    async createOne(id: string): Promise<File> {
        const element = document.getElementById(id);

        if (!element) {
            throw new QueryError(503, "Internal error");
        }

        if (!(element instanceof HTMLInputElement)) {
            throw new QueryError(503, "Internal error");
        }

        if (!element.files) {
            throw new QueryError(503, "No file selected");
        }

        const form = new FormData();
        form.append("file", element.files[0]);

        let res: Response;

        try {
            res = await fetch("http://localhost:8080/file", {
                method: "POST",
                body: form,
                headers: {
                    Accept: "application/json",
                },
                credentials: "include",
                redirect: "error",
            });
        } catch (e) {
            throw new QueryError(503, "Service Unavailable");
        }

        let json: any;

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
}
