// Returns true when the text is made up of spaces only (one or more, no other characters)
export const textAreOnlySpaces = (text: string): boolean => {
  return /^( )\1*$/.test(text);
};
