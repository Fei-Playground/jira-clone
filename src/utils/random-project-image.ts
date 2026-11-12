export const getRandomProjectImage = (): string => {
  // public/images/projects holds 1.svg to 25.svg
  const randomNumber = getRandomNumberBetweenRange(1, 25);
  return `/images/projects/${randomNumber}.svg`;
};

const getRandomNumberBetweenRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
