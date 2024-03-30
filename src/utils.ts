export const genNumbers = (length: number): string => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

export const checkGeneratedNumbers = (numbers: string): boolean => {
  const valuesToCheck = [1, 2, 3, 4];
  return valuesToCheck.every((value) => numbers.includes(value.toString()));
};
