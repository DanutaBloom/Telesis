# VSCode Configuration for Telesis Project

This directory contains optimized VSCode/Cursor settings for the Telesis Next.js project with proper Prettier + ESLint integration.

## Configuration Overview

### Hybrid Formatting Approach

- **ESLint**: Handles JavaScript, TypeScript, JSX, TSX files
- **Prettier**: Handles CSS, JSON, HTML, Markdown, YAML files
- **No conflicts**: eslint-config-prettier disables conflicting rules

### Files Configured

- `settings.json` - Editor settings and formatter assignments
- `extensions.json` - Recommended and unwanted extensions
- `tasks.json` - Build and formatting tasks
- `keybindings.json` - Custom keyboard shortcuts

## Key Features

### Format on Save
- **JS/TS files**: Formatted by ESLint with auto-fix
- **CSS/JSON/HTML/Markdown**: Formatted by Prettier
- **Auto imports**: Disabled to prevent conflicts
- **Final newline**: Automatically added

### Language-Specific Formatters
```json
"[typescript]": {
  "editor.defaultFormatter": "dbaeumer.vscode-eslint"
},
"[css]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### Tailwind CSS Integration
- Class attribute suggestions
- Emmet completions
- Custom class regex patterns for `cva`, `cn`, `cx`

## Keyboard Shortcuts

| Shortcut | Action | File Types |
|----------|--------|------------|
| `Ctrl+Shift+F` | Format current file | All (context-aware) |
| `Ctrl+Shift+.` | Quick fix ESLint issues | JS/TS |
| `Ctrl+Shift+O` | Organize imports (on-demand) | JS/TS |
| `Ctrl+K Ctrl+F` | Format all files in workspace | All |
| `Ctrl+K Ctrl+C` | Check format (no fixes) | All |
| `Alt+Z` | Toggle word wrap | All |

## Available Tasks (Ctrl+Shift+P → "Tasks: Run Task")

### Formatting Tasks
- **Format All Files (Prettier + ESLint)** - Complete project formatting
- **Check Format (Prettier + ESLint)** - Validation without fixes
- **Prettier: Fix All Files** - CSS/JSON/HTML/Markdown only
- **ESLint: Fix All Files** - JS/TS only

### Development Tasks
- **TypeScript: Check Types** - Type validation
- **Build Next.js App** - Production build
- **Start Development Server** - Dev server with hot reload

## Extensions

### Required Extensions
- `dbaeumer.vscode-eslint` - ESLint support
- `esbenp.prettier-vscode` - Prettier support
- `bradlc.vscode-tailwindcss` - Tailwind CSS IntelliSense

### Recommended Extensions
- `ms-playwright.playwright` - E2E testing
- `vitest.explorer` - Unit test runner
- `usernamehw.errorlens` - Inline error display

## Performance Optimizations

### File Exclusions
- Build outputs (`.next`, `dist`, `coverage`)
- Node modules and lock files
- Test results and reports

### Search Exclusions  
- Same as file exclusions plus binary files
- Improves search performance

### Explorer File Nesting
- Groups related files together
- Cleaner project structure view

## Usage Tips

### Format on Save Behavior
1. Open any file
2. Make changes
3. Save (`Ctrl+S`) - automatically formats based on file type

### Manual Formatting
- **Single file**: `Ctrl+Shift+F`
- **All files**: `Ctrl+K Ctrl+F`
- **Check only**: `Ctrl+K Ctrl+C`

### Quick Fixes
- **ESLint issues**: `Ctrl+Shift+.`
- **Import organization**: `Ctrl+Shift+O`

### Troubleshooting

#### Format on Save Not Working
1. Check file associations in `settings.json`
2. Verify correct formatter assigned per file type
3. Ensure required extensions are installed

#### ESLint/Prettier Conflicts
- Configuration prevents conflicts via `eslint-config-prettier`
- JS/TS files use ESLint only
- Other files use Prettier only

#### Performance Issues
- File exclusions minimize VSCode overhead
- Search exclusions improve find operations
- Consider increasing VSCode memory if needed

## Integration with npm Scripts

The configuration integrates with project npm scripts:

```bash
npm run format        # Format all files (Prettier + ESLint)
npm run format:check  # Check formatting without fixes
npm run lint:fix      # ESLint auto-fix only
npm run prettier:fix  # Prettier formatting only
```

## Customization

### Adding New File Types
Update `settings.json`:
```json
"[newtype]": {
  "editor.defaultFormatter": "appropriate.formatter"
}
```

### Adding Keyboard Shortcuts
Update `keybindings.json` with new key bindings.

### Adding Tasks
Update `tasks.json` with new build or formatting tasks.

## Compatibility

- **VSCode**: All versions with extension support
- **Cursor**: Full compatibility
- **Extensions**: Regularly updated versions recommended
- **Node.js**: Compatible with project's Node.js requirements