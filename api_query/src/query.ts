export abstract class Query<Parameters, Result> {
    abstract endpoint: string;

    async execute(query: Partial<Parameters>): Promise<Array<Result>> {
        let url = "/" + this.endpoint + "?";

        for (const [key, value] of Object.entries(query)) {
            url += `${key}=${value}&`
        }

        const res = await fetch(url);
        return await res.json();
    }
}
