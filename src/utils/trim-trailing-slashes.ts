export const trimTrailingSlashes = (path: string): string => {
  if (path === "/") return path;
  return path.replace(/\/+$/, "");
};
