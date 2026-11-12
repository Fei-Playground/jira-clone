// Returns the timestamp as one string combining 24-hour time and date, e.g. "18:04 · Nov 12, 2026".
export const formatDateTime = (timestamp: number): string => {
  const locale = "en-US";
  const date = new Date(timestamp).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = new Date(timestamp).toLocaleTimeString(locale, {
    hour12: false,
    timeStyle: "short",
  });

  return `${time} · ${date}`;
};
