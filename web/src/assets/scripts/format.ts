export function formatDate(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function date_to_hh_mm(date: Date | null): string {
  if (!date) {
    return "";
  }
  const minutes = date.getMinutes();
  return date.getHours() + ":" + (minutes > 9 ? minutes : "0" + minutes);
}

export function date_to_dd_MM_yyyy(date: Date | null): string {
  if (!date) {
    return "";
  }
  return (
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
}
