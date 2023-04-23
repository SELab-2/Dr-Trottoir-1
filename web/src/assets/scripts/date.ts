/**
 * @warning DEPRECATED
 * This function will be removed in favor of `new Date(ISO_STRING)`.
 */
export function createDate(str: string): Date {
  const dateParts = str.split("/");
  return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
}
