export function createDate(str: string): Date {
  const dateParts = str.split("/");
  return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
}
