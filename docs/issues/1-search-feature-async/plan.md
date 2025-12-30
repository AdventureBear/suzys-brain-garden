# Fix Search Feature for Eleventy v3 Async Compatibility

**Issue**: Search functionality is currently disabled due to Eleventy v3 async templateContent
**Branch**: `fix/search-feature-async`
**Date**: 2025-12-29

---

## Problem Analysis

### Current State
The search feature was disabled during the Eleventy v3 upgrade because:

1. **searchFilter.js** (lines 15, 22) accesses `page.templateContent` synchronously
2. In Eleventy v3, `templateContent` is now an async property
3. Filters cannot be async in Nunjucks templates
4. The search filter is commented out in `.eleventy.js:123-124`
5. `search-index.json.njk` was renamed to `.disabled`

### Files Involved

**Backend (Eleventy):**
- `filters/searchFilter.js` - Creates elasticlunr search index
- `.eleventy.js:122-127` - Search filter registration (commented out)
- `search-index.json.njk.disabled` - Template that generates search index JSON

**Frontend:**
- `_includes/components/head.njk:11,25-27` - Includes search.js and elasticlunr CDN
- `_includes/components/header.njk:12-18` - Search UI (input field, results)
- `_includes/assets/js/search.js` - Frontend search logic

**Dependencies:**
- `elasticlunr` (v0.9.5) - Search indexing library
- `emoji-regex` (v9.2.0) - Emoji filtering in search

### How Search Currently Works

1. **Build Time**: searchFilter processes all pages, creates elasticlunr index
2. **Output**: search-index.json.njk generates `/search-index.json` file
3. **Runtime**: Browser fetches `/search-index.json`, loads into elasticlunr
4. **User Action**: Typing in search field triggers client-side search

---

## Root Cause

Eleventy v3 made `templateContent` async to improve performance and enable parallel rendering. The old synchronous approach:

```javascript
// OLD (broken in v3)
collection.forEach((page) => {
  if (!page.templateContent) return;  // Synchronous access
  index.addDoc({
    content: squash(page.templateContent)  // Synchronous access
  });
});
```

This fails because `page.templateContent` is now a Promise in v3.

---

## Proposed Solution

### Option 1: Custom Collection with Async Processing (RECOMMENDED)

**Approach**: Create a custom collection that properly handles async templateContent

**Advantages**:
- Works with Eleventy v3's async architecture
- Minimal changes to existing code
- Maintains current search functionality
- Uses existing elasticlunr setup

**Implementation**:
1. Create new `collections/searchIndex.js` file
2. Use `Promise.all()` to wait for all templateContent
3. Build elasticlunr index after all content is loaded
4. Return index JSON for use in template
5. Update `.eleventy.js` to register the collection
6. Rename `search-index.json.njk.disabled` back to active
7. Update template to use the new collection

**Code Structure**:
```javascript
// collections/searchIndex.js
module.exports = async (collection) => {
  const pages = collection.getFilteredByGlob("**/*.md");

  // Wait for all templateContent to resolve
  const pagesWithContent = await Promise.all(
    pages.map(async (page) => ({
      ...page,
      content: await page.templateContent
    }))
  );

  // Build index (existing searchFilter logic)
  // Return JSON
};
```

### Option 2: Use Eleventy Global Data File

**Approach**: Create a JavaScript data file that builds the index

**Advantages**:
- Clean separation of concerns
- Follows Eleventy v3 patterns

**Disadvantages**:
- More structural change
- Different from current approach

### Option 3: Client-Side Only Search

**Approach**: Remove server-side indexing, build index in browser

**Advantages**:
- No async issues
- Simpler build

**Disadvantages**:
- Slower initial page load
- More client-side processing
- Not suitable for large sites

---

## Recommended Approach: Option 1

Create an async-compatible custom collection that builds the search index.

### Implementation Steps

1. Create `collections/searchIndex.js` with async support
2. Move searchFilter logic into the collection
3. Register collection in `.eleventy.js`
4. Restore `search-index.json.njk` (remove .disabled)
5. Update search-index template to use new collection
6. Test search functionality
7. Clean up old searchFilter.js (optional - could keep for reference)

### Files to Modify

- **NEW**: `collections/searchIndex.js`
- **MODIFY**: `.eleventy.js` (add collection, remove commented filter)
- **RENAME**: `search-index.json.njk.disabled` → `search-index.json.njk`
- **MODIFY**: `search-index.json.njk` (use new collection)
- **KEEP**: `filters/searchFilter.js` (for reference, or delete)

### Testing Checklist

- [ ] Site builds without errors
- [ ] `/search-index.json` is generated
- [ ] Search field appears in header
- [ ] Typing in search returns results
- [ ] Search results link to correct pages
- [ ] Search works with markdown content
- [ ] No console errors in browser
- [ ] Search index includes all expected pages

---

## Risk Assessment

**Low Risk** - This is a well-understood async pattern in Eleventy v3

**Potential Issues**:
- Large number of pages could slow build (current site is small)
- Memory usage for very large sites (not applicable here)
- Need to handle pages without content (404, etc.)

**Mitigation**:
- Filter out pages without templateContent
- Test with current content before deploying
- Monitor build times

---

## Success Criteria

- [ ] Search functionality fully restored
- [ ] No Eleventy v3 async warnings
- [ ] Build completes successfully
- [ ] Search index generated at `/search-index.json`
- [ ] Frontend search works as before
- [ ] No performance degradation
- [ ] Code follows Eleventy v3 best practices

---

## Next Steps

1. Get approval for Option 1 approach
2. Create detailed todo list
3. Implement solution
4. Test thoroughly
5. Document changes
6. Create PR
