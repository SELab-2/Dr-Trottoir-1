/**
 * @warning DEPRECATED
 * This function will be removed in favor of `new Date(ISO_STRING)`.
 */
export function createDate(str: string): Date {
  const dateParts = str.split("/");
  return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
}

/**
 * Create new date, given days away from given date
 * @param days
 * @param date
 */
export function daysFromDate(days: number, date: Date = new Date()): Date {
  const day = 24 * 60 * 60 * 1000;
  return new Date(date.getTime() + days * day);
}
