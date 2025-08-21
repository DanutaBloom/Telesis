module.exports = {
  // Only lint JavaScript/TypeScript files
  '**/*.{js,jsx,ts,tsx,mjs,cjs}': [
    // Auto-fix ESLint issues where possible, allow warnings but block on errors
    'eslint --fix --no-warn-ignored --cache --max-warnings 999',
  ],
  // Type check TypeScript files (only run once, not per file)
  '**/*.{ts,tsx}': [
    () => {
      console.log('🔍 Running TypeScript type checking...');
      return 'npm run check-types';
    }
  ],
  // Format CSS files
  '**/*.{css,scss,sass}': [
    'eslint --fix --cache --max-warnings 999',
  ],
};
