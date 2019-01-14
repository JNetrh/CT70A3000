fib = require('./fibonacci');

describe('fibonaci sequence', () => {
  test('When no attributes given we receive first ten results from 0', () => {
    expect(fib()).toEqual(
      expect.arrayContaining([1, 1, 2, 3, 5, 8, 13, 21, 34, 55])
    );
  });
  test('When only length given it returnes results from zero in given length', () => {
    expect(fib({ length: 5 }).length).toEqual(5);
  });
  test('when start is 100 and length is 8', () => {
    expect(fib({ start: 100, length: 8 })).toEqual(
      expect.arrayContaining([144, 233, 377, 610, 987, 1597, 2584, 4181])
    );
  });
  test('when length 10 do not expect the length will be 8', () => {
    expect(fib({ length: 10 }).length).not.toEqual(8);
  });
  test('when length below zero given, it returns empty array', () => {
    expect(fib({ length: -1 }).length).toEqual(0);
  });
  test('when start below zero given, it returns empty array', () => {
    expect(fib({ start: -1 }).length).toEqual(0);
  });
});
