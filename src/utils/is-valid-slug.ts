const SLUG_REGEX = /^[a-z0-9-]+$/;

export const isValidSlug = (value: string): boolean =>
  value.length > 0 && SLUG_REGEX.test(value);
