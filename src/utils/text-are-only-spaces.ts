// Checks whether the text consists only of spaces.
export const textAreOnlySpaces = (text: string): boolean => {
  return /^( )\1*$/.test(text);
};
