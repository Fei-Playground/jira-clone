const UNITS = ["B", "KB", "MB", "GB", "TB", "PB"] as const;

export const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0) {
    throw new RangeError("formatBytes expects a finite, non-negative number");
  }

  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < UNITS.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const rounded = unitIndex === 0 ? Math.round(value) : Math.round(value * 10) / 10;

  return `${rounded} ${UNITS[unitIndex]}`;
};
