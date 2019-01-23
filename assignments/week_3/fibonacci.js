const fib = object => {
  let len, start;
  if (!object) {
    start = 0;
    len = 10;
  } else {
    if (!object.hasOwnProperty('start')) {
      start = 0;
    } else {
      start = object.start;
    }
    if (!object.hasOwnProperty('length')) {
      len = 10;
    } else {
      len = object.length;
    }
  }
  if (len <= 0) {
    return [];
  }
  if (start < 0) {
    return [];
  }
  let fib = fibonacci(start);
  let result = [];
  result.push(fib[fib.length - 1]);
  result.push(fib[fib.length - 1]);
  if (start == 0) {
    result = [0, 1];
  }

  for (let i = 2; i <= len + 0; i++) {
    result[i] = result[i - 1] + result[i - 2];
  }

  return result.slice(1);
};

const fibonacci = start => {
  let x = [];
  x[0] = 0;
  x[1] = 1;

  for (let i = 2; i <= start + 2; i++) {
    x[i] = x[i - 1] + x[i - 2];

    if (start <= x[i]) {
      return x;
    }
  }
  return x;
};

module.exports = fib;
