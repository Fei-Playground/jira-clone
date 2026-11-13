export const DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000;

export const addDays = (timestamp: number, days: number): number => {
  const date = new Date(timestamp);
  date.setDate(date.getDate() + days);
  return date.valueOf();
};

export const formatDate = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/** The `YYYY-MM-DD` an `<input type="date">` reads and writes, in local time. */
export const toDateInputValue = (timestamp: number): string => {
  const date = new Date(timestamp);
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
};

export const fromDateInputValue = (value: string): number =>
  new Date(`${value}T00:00:00`).valueOf();
