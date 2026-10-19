const locale = "en-US";

export const formatDate = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatDateTime = (timestamp: number): string => {
  const time = new Date(timestamp).toLocaleTimeString(locale, {
    hour12: false,
    timeStyle: "short",
  });

  return `${time} · ${formatDate(timestamp)}`;
};
