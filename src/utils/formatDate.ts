export const formatDate = (timestamp: number): string => {
  const locale = "en-US";
  const date = new Date(timestamp).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return date;
};
