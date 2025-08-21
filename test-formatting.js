// This file has formatting issues for testing pre-commit hooks
const _badlyFormatted = {
  key1: "value1",
  key2: "value2",
}

function _poorlyFormatted(param1, param2) {
  return {
    result: param1 + param2,
    message: "this is not formatted properly"
  }
}

const _array = [1, 2, 3, 4, 5]
const _object = {a: 1, b: 2, c: 3}

// Allow console in test files by using a comment
/* eslint-disable-next-line no-console */
console.log("This should be formatted by prettier and linted by ESLint")
