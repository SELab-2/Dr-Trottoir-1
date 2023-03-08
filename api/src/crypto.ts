import { BinaryLike } from "crypto";
import crypto from "crypto";

/**
 * Wrap an asynchronous call to pbkdf2Async in a promise for convenience.
 */
export function pbkdf2Async(
    password: BinaryLike,
    salt: BinaryLike,
    iterations: number,
    keylen: number,
    digest: string,
): Promise<Buffer> {
    return new Promise((res, rej) => {
        crypto.pbkdf2(
            password,
            salt,
            iterations,
            keylen,
            digest,
            (err, key) => {
                err ? rej(err) : res(key);
            },
        );
    });
}
