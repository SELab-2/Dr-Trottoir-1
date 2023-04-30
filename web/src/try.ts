import { QueryError } from "@selab-2/groep-1-query";
import { useErrorStore } from "./stores/error";

/*
 * Receives an object and prints it to an alert and the console.
 */
function handler(err: unknown): void {
  useErrorStore().addToStore(err)
}

/**
 * Attempt to execute a function which may throw an exception. If it does, it
 * will be caught and shown in a browser alert in JSON and return `undefined`.
 * On success, it will return the result of the specified function itself.
 * @param func The function to be executed.
 * @param T The return type of `func`
 *
 * Example:
 * ```
 * // Will show alert if y is zero and return undefined.
 * const x = random();
 * const y = random();
 * const result: number | undefined = tryOrAlert<number>(() => {
 *   return x / y;
 * });
 * ```
 */
export function tryOrAlert<T>(func: () => T): T | undefined {
  try {
    return func();
  } catch (err) {
    handler(err);
  }
}

/**
 * Attempt to execute a function which may throw an exception. If it does, it
 * will be caught and shown in a browser alert in JSON and return `undefined`.
 * On success, it will return the result of the specified function itself.
 * @param func The function to be executed. May be asynchronous.
 * @param T The return type of `func`
 *
 * Example:
 * ```
 * // Will show alert if y is zero and return undefined.
 * const x = await randomAsync();
 * const y = await randomAsync();
 * const result: number | undefined = await tryOrAlertAsync<number>(async () => {
 *   return x / y;
 * });
 * ```
 */
export async function tryOrAlertAsync<T>(
  func: () => Promise<T>,
): Promise<T | undefined> {
  try {
    return await func();
  } catch (err) {
    handler(err);
  }
}
