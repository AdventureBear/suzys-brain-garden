# Node 22 Local Development Fix Plan

**Issue**: Cannot run `npm start` locally after upgrading from Node 14 to Node 22, though the site builds successfully on Netlify.

**Branch**: `fix/node22-local-dev-setup`

**Date**: 2025-12-29

---

## Problem Summary

The 11ty site (Suzy's Brain Garden) was originally built in ~2020 with Node 14. After upgrading to Node 22, local development is broken while Netlify builds continue to work. The site uses Eleventy 0.11.1 (released in 2020) with Tailwind CSS 2.0 and numerous outdated dependencies.

### Symptoms

1. No `npm run dev` script exists (should use `npm start`)
2. Running `npm start` fails with:
   ```
   sh: postcss: command not found
   sh: eleventy: command not found
   ```
3. Missing `node_modules` directory and `package-lock.json`

### Root Cause

1. **Missing Dependencies**: The `node_modules` directory was never installed after the Node version upgrade
2. **Version Incompatibility**: Eleventy 0.11.1 and most dependencies are from 2020 and have compatibility issues with Node 22
3. **Outdated Tooling**: Multiple deprecated packages and outdated syntax

---

## Identified Issues

### Critical Issues

| Package | Current Version | Issue | Recommended Version |
|---------|----------------|-------|-------------------|
| `@11ty/eleventy` | ^0.11.1 | Released Dec 2020; doesn't support Node 22 | ^3.0.0 (latest stable) |
| `tailwindcss` | ^2.0.2 | Uses deprecated `purge` config; v2 is EOL | ^4.0.0 (latest) |
| `postcss-cli` | ^8.3.0 | Old version; compatibility issues with Node 22 | ^11.0.0 |
| `alpinejs` | ^2.7.3 | Old v2 branch; v3 has better Node support | ^3.14.0 |
| `eslint` | ^7.9.0 | 2020 version; known Node 22 issues | ^9.0.0 |
| `markdown-it` | ^10.0.0 | 2019 release; security/compatibility issues | ^14.0.0 |
| `html-minifier` | ^4.0.0 | Unmaintained; last update 2018 | Use `html-minifier-terser` ^7.0.0 |
| `uglify-es` | ^3.3.9 | Deprecated; should use modern minifier | Remove (use terser or esbuild) |
| `clean-css-cli` | ^4.3.0 | Old version; may have Node 22 issues | ^5.6.0 |

### Additional Outdated Plugins

- `@11ty/eleventy-img`: ^0.5.0 → ^4.0.0
- `@11ty/eleventy-navigation`: ^0.1.6 → ^0.3.0
- `@tailwindcss/forms`: ^0.2.1 → ^0.5.0
- `@tailwindcss/typography`: ^0.3.1 → ^0.5.0
- `autoprefixer`: ^10.1.0 → ^10.4.0
- Various `markdown-it-*` plugins need updates

### Script Issues

The `start` script uses background process syntax (`&`) that may behave inconsistently:
```json
"start": "eleventy --serve & postcss styles/tailwind.css --o _tmp/style.css --watch"
```

Should use proper concurrent execution tool like `concurrently` or `npm-run-all`.

---

## Step-by-Step Fix Plan

### Phase 1: Install Current Dependencies (Quick Test)

**Goal**: Attempt to install existing dependencies to see if they work with Node 22

1. **Try standard npm install**:
   ```bash
   npm install
   ```

2. **If that fails, try with legacy peer deps**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Test if the site runs**:
   ```bash
   npm start
   ```

**Expected Outcome**: This will likely fail or produce warnings, but will help identify specific compatibility issues.

---

### Phase 2: Update to Modern Versions (Recommended Approach)

**Goal**: Update all dependencies to versions compatible with Node 22

#### 2.1 Update Core 11ty and Build Tools

1. **Update Eleventy to latest stable version**:
   ```bash
   npm install --save-dev @11ty/eleventy@^3.0.0
   ```

2. **Update Tailwind CSS to v4**:
   ```bash
   npm install --save-dev tailwindcss@^4.0.0
   npm install --save-dev postcss@^8.4.0
   npm install --save-dev postcss-cli@^11.0.0
   npm install --save-dev autoprefixer@^10.4.0
   ```

3. **Update Tailwind plugins**:
   ```bash
   npm install --save @tailwindcss/forms@^0.5.0
   npm install --save @tailwindcss/typography@^0.5.0
   ```

4. **Update Alpine.js**:
   ```bash
   npm install --save-dev alpinejs@^3.14.0
   ```

#### 2.2 Update Eleventy Plugins

```bash
npm install --save @11ty/eleventy-img@^4.0.0
npm install --save @11ty/eleventy-navigation@^0.3.0
npm install --save eleventy-plugin-embed-everything@latest
npm install --save eleventy-plugin-svg-contents@latest
npm install --save eleventy-plugin-nesting-toc@latest
npm install --save eleventy-plugin-toc@latest
```

#### 2.3 Update Markdown-it and Plugins

```bash
npm install --save markdown-it@^14.0.0
npm install --save markdown-it-anchor@^9.0.0
npm install --save markdown-it-attrs@^4.0.0
npm install --save markdown-it-emoji@^3.0.0
npm install --save markdown-it-footnote@^4.0.0
npm install --save markdown-it-container@^4.0.0
npm install --save markdown-it-task-lists@^2.1.1
```

#### 2.4 Replace Deprecated Packages

1. **Replace html-minifier with html-minifier-terser**:
   ```bash
   npm uninstall html-minifier
   npm install --save html-minifier-terser@^7.0.0
   ```

2. **Remove uglify-es (deprecated)**:
   ```bash
   npm uninstall uglify-es
   ```
   Use Terser or esbuild for JS minification instead.

3. **Update clean-css-cli**:
   ```bash
   npm install --save-dev clean-css-cli@^5.6.0
   ```

#### 2.5 Update Development Tools

```bash
npm install --save-dev eslint@^9.0.0
npm install --save-dev prettier@^3.0.0
npm install --save-dev luxon@^3.4.0
```

#### 2.6 Add Concurrent Script Runner

```bash
npm install --save-dev concurrently@^9.0.0
```

---

### Phase 3: Update Configuration Files

#### 3.1 Update `.eleventy.js`

Check for breaking changes in Eleventy 3.x:
- Review plugin API changes
- Update any deprecated configuration options
- Test all custom filters and collections

**Key changes likely needed**:
- Eleventy 3.x uses ESM by default, but CommonJS still supported
- Some plugin APIs may have changed
- Image plugin has new options and behaviors

#### 3.2 Update Tailwind Configuration

**File**: `styles/tailwind.config.js`

Change from Tailwind v2 to v4 syntax:
```javascript
// OLD (v2):
module.exports = {
  purge: {
    content: ['./_site/**/*.html'],
    options: {
      safelist: []
    }
  },
  darkMode: 'class',
  // ...
}

// NEW (v4):
module.exports = {
  content: ['./_site/**/*.html'],
  darkMode: 'class',
  // ...
}
```

The `purge` option is now just `content` in v4.

#### 3.3 Update PostCSS Configuration

**File**: `postcss.config.js`

Current should be fine, but verify it's using latest syntax:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

#### 3.4 Update package.json Scripts

Replace the `start` script with a more robust concurrent execution:

**Before**:
```json
"start": "eleventy --serve & postcss styles/tailwind.css --o _tmp/style.css --watch"
```

**After**:
```json
"start": "concurrently \"eleventy --serve\" \"postcss styles/tailwind.css --o _tmp/style.css --watch\"",
"dev": "npm start"
```

Also update the `build` script if needed to use `html-minifier-terser` instead of `html-minifier`.

---

### Phase 4: Code Changes for Breaking Changes

#### 4.1 Update html-minifier imports

Search for any references to `html-minifier` in `.eleventy.js`:

```bash
grep -r "html-minifier" .eleventy.js
```

Replace:
```javascript
// OLD
const htmlmin = require('html-minifier');

// NEW
const htmlmin = require('html-minifier-terser');
```

#### 4.2 Update Alpine.js integration

Alpine.js v3 has a different initialization syntax. Update any Alpine.js scripts in templates:

**In templates** (check `_includes/layouts/base.njk`):
```html
<!-- OLD (v2) -->
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>

<!-- NEW (v3) -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

#### 4.3 Test and fix markdown-it plugins

Some markdown-it plugins may have breaking changes. Test all markdown rendering features:
- Footnotes
- Task lists
- Emoji
- Anchors
- Custom attributes
- Containers

---

### Phase 5: Testing

#### 5.1 Install Dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

#### 5.2 Test Local Development

```bash
npm start
```

Expected behavior:
- Eleventy dev server starts on `http://localhost:8080`
- PostCSS watches and compiles Tailwind CSS
- Changes to content trigger rebuilds
- Hot reload works

#### 5.3 Test Production Build

```bash
npm run build
```

Expected behavior:
- Site builds to `_site/` directory
- CSS is minified and optimized
- HTML is minified
- No errors or warnings

#### 5.4 Visual Testing

1. Check homepage renders correctly
2. Test dark mode toggle
3. Test navigation
4. Test search functionality
5. Test all markdown features (tables, code blocks, etc.)
6. Verify responsive design works

#### 5.5 Verify Netlify Compatibility

Before pushing:
1. Check that the build command in `netlify.toml` still works
2. Verify Node version in `.nvmrc` is correct (v22)
3. Test the build locally with Netlify CLI if available:
   ```bash
   netlify build
   ```

---

## Alternative: Conservative Approach

If updating to modern versions causes too many breaking changes, try this more conservative approach:

1. **Use the last versions that support Node 18/20**:
   - `@11ty/eleventy@^2.0.0` (more stable than 3.x, supports Node 18+)
   - `tailwindcss@^3.4.0` (v3 is stable and well-supported)
   - Keep most other packages at current versions

2. **Only update critical incompatible packages**:
   - Replace `html-minifier` with `html-minifier-terser`
   - Update `eslint` to v8.x (not v9)
   - Update `postcss-cli` to v10.x

3. **Use Node 18 instead of Node 22**:
   - Update `.nvmrc` to `v18`
   - This gives more compatibility with older packages
   - Still modern and supported until 2025

---

## Success Criteria

- [ ] `npm install` completes without errors
- [ ] `npm start` runs local dev server successfully
- [ ] Site is accessible at `http://localhost:8080`
- [ ] Hot reload works when editing content
- [ ] `npm run build` completes successfully
- [ ] Built site in `_site/` renders correctly
- [ ] All pages load without errors
- [ ] Dark mode works
- [ ] Search functionality works
- [ ] Navigation works
- [ ] No console errors in browser
- [ ] Netlify build still succeeds

---

## Rollback Plan

If updates cause too many issues:

1. **Revert package.json changes**:
   ```bash
   git checkout package.json package-lock.json
   ```

2. **Try downgrading Node to v18**:
   - Edit `.nvmrc`: change from `v22` to `v18`
   - Run `nvm use`
   - Try `npm install` again

3. **Use legacy peer deps flag**:
   ```bash
   npm install --legacy-peer-deps
   ```

---

## Timeline Estimate

- **Phase 1** (Quick test): 10 minutes
- **Phase 2** (Update dependencies): 30-45 minutes
- **Phase 3** (Config updates): 20-30 minutes
- **Phase 4** (Code changes): 30-60 minutes
- **Phase 5** (Testing): 30-45 minutes

**Total**: 2-3 hours

---

## Notes

- The site works on Netlify because Netlify does a fresh `npm install` in CI/CD with Node 22
- The local environment lacks `node_modules` entirely
- This is a 2020-era codebase that needs modernization to work with Node 22
- Breaking changes are expected when upgrading 4+ years of dependencies
- Take incremental approach: test after each phase
- Keep git commits small for easy rollback

---

## Resources

- [Eleventy 3.0 Release Notes](https://www.11ty.dev/blog/eleventy-v3/)
- [Eleventy 2.0 Release Notes](https://www.11ty.dev/blog/eleventy-v2/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Alpine.js v3 Migration Guide](https://alpinejs.dev/upgrade-guide)
- [Node.js 22 Release Notes](https://nodejs.org/en/blog/release/v22.0.0)
