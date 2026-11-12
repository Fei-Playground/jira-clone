export const getRandomProjectImage = (): string => {
  const randomNumber = getRandomNumberBetweenRange(1, 25);
  return `/images/projects/${randomNumber}.svg`;
};

const getRandomNumberBetweenRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
