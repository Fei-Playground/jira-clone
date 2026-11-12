export const formatDateTime = (timestamp: number): string => {
  const locale = "en-US";
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const formattedDate = date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = date.toLocaleTimeString(locale, {
    hour12: false,
    timeStyle: "short",
  });

  return `${time} · ${formattedDate}`;
};
