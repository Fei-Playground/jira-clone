export const formatDateTime = (timestamp: number): string => {
  const locale = "en-US";
  const parsedDate = new Date(timestamp);

  if (Number.isNaN(parsedDate.getTime())) return "";

  const date = parsedDate.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = parsedDate.toLocaleTimeString(locale, {
    hour12: false,
    timeStyle: "short",
  });

  return `${time} · ${date}`;
};
