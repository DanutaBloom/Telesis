// Test file for ESLint pre-commit hook validation

function test_function() {
  // eslint-disable-next-line no-console
  console.log('This should have formatting issues');
  const badVariable = 1;
  if (badVariable === 1) {
    // eslint-disable-next-line no-console
    console.log('Double quotes issue');
  }
}

export default test_function;
