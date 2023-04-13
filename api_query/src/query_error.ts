/**
 * Modeleert een HTTP error. Wordt opgegooid indien er een fout optreedt tijdens
 * het verkrijgen van de resultaten.
 */
export class QueryError extends Error {
    code: number;
    message: string;

    constructor(code: number, message: string) {
        super();
        this.code = code;
        this.message = message;
    }
}
