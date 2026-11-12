export const textAreOnlySpaces = (text: string): boolean => {
  return /^\s+$/.test(text);
};
