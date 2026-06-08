export const formatFileSize = (bytes: number): string => {
  const MB_THRESHOLD = 1_048_576; // 1 MB in bytes
  const KB_IN_BYTES = 1024;

  if (bytes >= MB_THRESHOLD) {
    const mb = (bytes / MB_THRESHOLD).toFixed(1);
    return `${mb} MB`;
  }

  const kb = Math.round(bytes / KB_IN_BYTES);
  return `${kb} KB`;
};
