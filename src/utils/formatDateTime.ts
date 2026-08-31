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

const RELATIVE_DIVISIONS: {
  amount: number;
  unit: Intl.RelativeTimeFormatUnit;
}[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

export const formatRelativeTime = (timestamp: number, now: number = Date.now()): string => {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  let duration = (timestamp - now) / 1000;

  for (const division of RELATIVE_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return rtf.format(0, "second");
};
