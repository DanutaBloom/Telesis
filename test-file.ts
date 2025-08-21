// Test file to verify ESLint and lint-staged are working

export const testFunction = () => {
  console.log('hello world'); // This will be a warning but shouldn't block in dev
  return 'test';
};
