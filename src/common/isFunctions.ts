const isString = (str: any) => typeof str === "string" || str instanceof String;

const isLooselyNumeric = (value: any) => {
  return Number(value) == value;
};

export const isFunctions = {
  isString,
  isLooselyNumeric,
};
