const isNumericLoosely = (value: any) => {
  return Number(value) == value;
};

[
  "123",
  123,
  123.000001,
  "123.000001",
  "-123.000001",
  ,
  "+123.000001",
  "e",
  "i",
  "3i",
  "0.0000000",
  "0.0000001",
  "one",
  "0",
  0,
].forEach((number) => {
  console.log(`isNumericLoosely(${number}) == ${isNumericLoosely(number)}`);
});
