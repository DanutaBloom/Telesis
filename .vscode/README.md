# VSCode/Cursor ESLint Integration Setup

This directory contains optimized VSCode/Cursor configuration files for the best ESLint integration and developer experience with the Telesis project.

## 📁 Configuration Files

### `settings.json`
Main workspace settings that configure:
- **ESLint Integration**: Flat config support, auto-fix on save, real-time linting
- **TypeScript Settings**: Strict mode, auto-imports, inlay hints
- **File Formatting**: ESLint as primary formatter, disabled Prettier conflicts
- **Performance**: Optimized file watching and exclusions
- **Cursor AI Integration**: Enhanced autocomplete and chat features
- **Visual Enhancements**: Bracket colorization, error indicators, deprecation warnings

### `extensions.json`
Recommended and unwanted extensions:
- **Recommended**: ESLint, TypeScript, Tailwind CSS, Playwright, Vitest, GitLens
- **Unwanted**: Prettier (conflicts with ESLint), duplicate functionality extensions
- **Auto-installs** recommended extensions when opening the project

### `launch.json`
Debug configurations for:
- **Next.js**: Server-side, client-side, and full-stack debugging
- **ESLint**: Debug ESLint rules and configuration
- **Testing**: Vitest and Playwright test debugging
- **TypeScript**: Compilation debugging
- **API Routes**: Node.js debugging for API endpoints

### `tasks.json`
Predefined tasks for common operations:
- **ESLint**: Check/fix all files or current file
- **TypeScript**: Type checking
- **Testing**: Unit tests, E2E tests
- **Build**: Development server, production build
- **Debugging**: ESLint configuration inspection

### `keybindings.json`
Custom keyboard shortcuts:
- `Ctrl+Shift+L` - Auto-fix ESLint errors in current file
- `Ctrl+Shift+E` - Check current file with ESLint
- `Ctrl+Shift+F` - Fix current file with ESLint
- `Ctrl+Shift+A` - Check all files with ESLint
- `Ctrl+Shift+T` - Run TypeScript type checking
- `F8` / `Shift+F8` - Navigate between errors/warnings

### `snippets.json`
Code snippets for faster development:
- `rfc` - React functional component
- `nextpage` - Next.js page component
- `nextapi` - Next.js API route
- `vitest` - Vitest test template
- `playwright` - Playwright E2E test template
- `type` - TypeScript type definition
- `asyncfn` - Async function with error handling

## 🚀 Getting Started

1. **Open the project in Cursor/VSCode**
2. **Install recommended extensions** when prompted
3. **Verify ESLint is working** - you should see real-time error indicators
4. **Test auto-fix** - save a file and watch ESLint auto-format it
5. **Try keyboard shortcuts** - use `Ctrl+Shift+L` to fix ESLint errors

## ✅ Verification Checklist

### ESLint Integration
- [ ] ESLint extension is installed and enabled
- [ ] Real-time error/warning indicators appear in editor
- [ ] Auto-fix works on save (`Ctrl+S`)
- [ ] Problems panel shows ESLint issues (`Ctrl+Shift+M`)
- [ ] No Prettier conflicts (Prettier should be disabled)

### TypeScript Integration
- [ ] TypeScript errors appear in real-time
- [ ] Auto-imports work when typing component names
- [ ] Go to definition works (`F12`)
- [ ] Type checking task works (`Ctrl+Shift+T`)
- [ ] Inlay hints show parameter and return types

### Performance
- [ ] File watching excludes build directories
- [ ] ESLint runs without noticeable lag
- [ ] Search excludes node_modules and build artifacts
- [ ] No duplicate extension warnings

### Testing Integration
- [ ] Vitest tests can be run from Command Palette
- [ ] Playwright tests can be debugged
- [ ] Test files have proper syntax highlighting
- [ ] Coverage reports generate correctly

## 🛠️ Troubleshooting

### ESLint Not Working
1. **Check ESLint Output Panel**: View → Output → ESLint
2. **Restart ESLint Server**: Command Palette → "ESLint: Restart ESLint Server"
3. **Verify Flat Config**: Ensure `eslint.useFlatConfig: true` in settings
4. **Check Working Directory**: Verify `eslint.workingDirectories: ["./"]`

### Auto-Fix Not Working
1. **Check Format on Save**: Ensure `editor.formatOnSave: true`
2. **Verify Code Actions**: Ensure `source.fixAll.eslint: "explicit"`
3. **File Association**: Check file type is associated with ESLint
4. **ESLint Rule**: Verify the rule is fixable (some rules are warning-only)

### Performance Issues
1. **Disable Prettier**: Ensure Prettier extension is disabled
2. **Check File Exclusions**: Verify large directories are excluded
3. **Restart TypeScript**: Use `Ctrl+Shift+R` to restart TS server
4. **Clear Cache**: Reload window with `Ctrl+Shift+P` → "Developer: Reload Window"

### Cursor-Specific Issues
1. **AI Features**: Ensure Cursor-specific settings are enabled in settings.json
2. **Chat Integration**: Verify `cursor.chat.enableChatHistory: true`
3. **Autocompletions**: Check `cursor.general.enableAutocompletions: true`

## 🔧 Customization

### Adding New ESLint Rules
1. Edit `eslint.config.mjs` in project root
2. Restart ESLint server
3. Test with `Ctrl+Shift+E` on a file

### Custom Snippets
1. Edit `.vscode/snippets.json`
2. Use snippet prefix in editor
3. Tab through placeholder variables

### Custom Keybindings
1. Edit `.vscode/keybindings.json`
2. Use Command Palette to find command names
3. Test shortcuts immediately

### Workspace Settings
1. Edit `.vscode/settings.json`
2. Settings apply only to this workspace
3. Override user settings automatically

## 📊 Performance Monitoring

### ESLint Performance
- **Lint Time**: Should complete in <2 seconds for most files
- **Auto-fix Time**: Should be instantaneous on save
- **Memory Usage**: Monitor ESLint server memory in Output panel

### TypeScript Performance
- **Type Checking**: Should complete in <5 seconds
- **IntelliSense**: Should appear within 500ms
- **File Navigation**: Should be instantaneous

### File Watching
- **Excluded Directories**: node_modules, .next, build, dist, coverage
- **Watched Files**: Only source files and configurations
- **Search Performance**: Should exclude build artifacts

## 🧪 Testing the Setup

### Manual Tests
1. **Create a new TypeScript file** with intentional errors
2. **Verify ESLint highlights** syntax and style issues
3. **Save the file** and check auto-fix works
4. **Use `Ctrl+Shift+L`** to manually trigger auto-fix
5. **Check Problems panel** for comprehensive error list

### Automated Verification
```bash
# Test ESLint configuration
npm run lint

# Test TypeScript compilation
npm run check-types

# Test all tasks work
npm run test
npm run build
```

## 🎯 Expected Developer Experience

### Instant Feedback
- **Red squiggles** for ESLint errors
- **Yellow squiggles** for warnings
- **Blue squiggles** for suggestions
- **Grayed out text** for unused code

### Auto-fixing
- **Save file** → Auto-fix formatting and simple errors
- **Organize imports** → Automatic import sorting
- **Remove unused** → Automatic cleanup of unused variables

### Visual Indicators
- **Error count** in status bar
- **Problem panel** with filterable issues
- **File icons** show error/warning states
- **Minimap** highlights problematic areas

### Productivity Features
- **Quick fixes** with `Ctrl+.`
- **Keyboard shortcuts** for common tasks
- **Code snippets** for rapid development
- **IntelliSense** with type information
- **Auto-imports** for components and utilities

This setup ensures a smooth, productive development experience with minimal friction and maximum code quality assurance.