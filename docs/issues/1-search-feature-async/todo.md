# TODO: Fix Search Feature for Eleventy v3

**Issue**: Search functionality async compatibility
**Status**: Planning Complete - Awaiting Approval
**Last Updated**: 2025-12-29

---

## Planning Phase

- [x] Analyze the search feature issue
- [x] Review existing searchFilter.js implementation
- [x] Understand Eleventy v3 async requirements
- [x] Identify all affected files
- [x] Research solution approaches
- [x] Create detailed plan (Option 1: Async Custom Collection)
- [x] Create this todo list
- [ ] Get user approval to proceed

---

## Implementation Phase

### 1. Setup & Preparation

- [ ] Create `collections/` directory if it doesn't exist
- [ ] Verify elasticlunr and emoji-regex dependencies are installed

### 2. Create Async Search Index Collection

- [ ] Create new file: `collections/searchIndex.js`
- [ ] Implement async collection function
- [ ] Port searchFilter logic to handle async templateContent
- [ ] Use Promise.all() to wait for all content
- [ ] Maintain existing squash() function for text processing
- [ ] Maintain existing emoji removal logic
- [ ] Return JSON formatted for elasticlunr
- [ ] Add error handling for pages without content
- [ ] Add comments explaining async pattern

### 3. Update Eleventy Configuration

- [ ] Open `.eleventy.js`
- [ ] Remove commented searchFilter lines (122-124)
- [ ] Add new searchIndex collection registration
- [ ] Verify "results" collection is still needed (line 125-127)
- [ ] Test that configuration loads without errors

### 4. Restore Search Index Template

- [ ] Rename `search-index.json.njk.disabled` to `search-index.json.njk`
- [ ] Update template to use new collection
- [ ] Change from `{{ collections.results | search | dump | safe }}`
- [ ] To `{{ collections.searchIndex | dump | safe }}`
- [ ] Verify frontmatter permalink is correct

### 5. Verify Frontend Integration

- [ ] Confirm `_includes/components/head.njk` includes search.js
- [ ] Confirm elasticlunr CDN is loaded (line 26)
- [ ] Verify search UI in `_includes/components/header.njk`
- [ ] Check that `site.enableSearch` is set to 1 in site config

---

## Testing Phase

### Build Testing

- [ ] Run `npm run build` - verify no errors
- [ ] Check `_site/search-index.json` exists
- [ ] Verify search-index.json has expected structure
- [ ] Check file size is reasonable
- [ ] Verify all expected pages are in index

### Development Server Testing

- [ ] Run `npm start` - verify no errors
- [ ] Open http://localhost:8080/
- [ ] Verify search field appears in header
- [ ] Check browser console for errors
- [ ] Verify elasticlunr library loads

### Search Functionality Testing

- [ ] Type in search field - verify it accepts input
- [ ] Search for common word - verify results appear
- [ ] Verify search results have correct titles
- [ ] Click result link - verify it navigates correctly
- [ ] Search for unique term - verify it finds the right page
- [ ] Search for non-existent term - verify "no results" message
- [ ] Test with special characters
- [ ] Test with emoji
- [ ] Clear search - verify results disappear
- [ ] Click outside search - verify dropdown closes

### Edge Case Testing

- [ ] Test search with very long query
- [ ] Test search with only spaces
- [ ] Test search with markdown syntax (e.g., `##`, `**`)
- [ ] Verify 404 page is not in search results
- [ ] Verify pages without content are handled gracefully

---

## Documentation Phase

- [ ] Update `docs/issues/1-search-feature-async/implementation-summary.md`
- [ ] Document the async pattern used
- [ ] Note any issues encountered
- [ ] List all files modified
- [ ] Include code snippets of key changes
- [ ] Add testing results
- [ ] Document any decisions made during implementation

---

## Cleanup & Optimization (Optional)

- [ ] Consider removing old `filters/searchFilter.js` (or keep for reference)
- [ ] Review if "results" collection is still needed
- [ ] Check for any unused search-related code
- [ ] Optimize search index size if needed
- [ ] Consider adding build-time search statistics

---

## Git & PR Phase

- [ ] Review all changes with `git diff`
- [ ] Stage all modified files
- [ ] Create meaningful commit message
- [ ] Push branch to remote
- [ ] Create pull request
- [ ] Write clear PR description
- [ ] Link to this issue documentation
- [ ] Request review if needed

---

## Post-Merge Tasks

- [ ] Verify search works in production/Netlify
- [ ] Monitor for any user-reported issues
- [ ] Update main IDEAS.md to mark search as completed
- [ ] Close this issue

---

## Rollback Plan (If Needed)

If the implementation fails:

1. Revert changes to `.eleventy.js`
2. Remove `collections/searchIndex.js`
3. Rename `search-index.json.njk` back to `.disabled`
4. Restore commented searchFilter lines
5. Document what went wrong in implementation-summary.md

---

## Notes & Decisions

- Using Option 1 (Async Custom Collection) as recommended in plan
- Keeping existing elasticlunr setup (not upgrading to newer search library)
- Maintaining backward compatibility with existing search UI
- Not changing frontend search.js (no modifications needed)

---

## Questions to Resolve

- [ ] Should we keep the old searchFilter.js file for reference?
- [ ] Is the "results" collection still needed or was it only for search?
- [ ] Any specific pages that should be excluded from search?

---

## Estimated Complexity

**Implementation**: Low-Medium
**Testing**: Medium
**Risk**: Low

**Rationale**: Well-understood async pattern, existing code can be adapted, minimal changes to frontend.
