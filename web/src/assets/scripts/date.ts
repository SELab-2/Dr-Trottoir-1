export function formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function createDate(str: string): Date {
  const dateParts = str.split("/");
  return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
}
