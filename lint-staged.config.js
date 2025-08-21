module.exports = {
  // Format and lint JavaScript/TypeScript files (Prettier first, then ESLint)
  '**/*.{js,jsx,ts,tsx,mjs,cjs}': [
    // First run Prettier to fix formatting
    'prettier --write --cache',
    // Then run ESLint to fix code issues (allow warnings, block on errors only)
    'eslint --fix --no-warn-ignored --cache --max-warnings 999 --report-unused-disable-directives',
  ],
  
  // Format CSS files (both Prettier and ESLint for comprehensive handling)
  '**/*.{css,scss,sass}': [
    // Prettier handles basic formatting
    'prettier --write --cache',
    // ESLint handles CSS-specific rules if configured
    'eslint --fix --cache --max-warnings 999 --report-unused-disable-directives --no-warn-ignored',
  ],
  
  // Format other files with Prettier only (JSON, HTML, Markdown)
  '**/*.{html,json,jsonc,md,mdx}': [
    'prettier --write --cache',
  ],
  
  // Type check TypeScript files (only run once, not per file)
  '**/*.{ts,tsx}': [
    () => {
      console.log('🔍 Running TypeScript type checking...');
      return 'npm run check-types';
    }
  ],
};
