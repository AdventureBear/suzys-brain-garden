# Plan: Reorganize Project Structure - Clean Up Legacy Filters

## Issue Overview

The `/filters/` directory at the root level contains only a legacy `searchFilter.js` file that is no longer in use. This file was replaced during the Eleventy v3 upgrade (issue #1) with an async-compatible collection located at `/lib/collections/searchIndex.js`.

## Current State Analysis

### Directory Structure
```
/
├── filters/
│   └── searchFilter.js (LEGACY - not used)
├── lib/
│   └── collections/
│       └── searchIndex.js (ACTIVE - replacement for searchFilter)
└── .eleventy.js
```

### How Eleventy Utilities Are Currently Organized

1. **Filters**: All active filters are defined inline in `.eleventy.js`:
   - `readableDate` (line 139)
   - `machineDate` (line 144)
   - `cssmin` (line 150)
   - `jsmin` (line 155)

2. **Collections**: Mixed approach
   - `searchIndex` - uses new `/lib/collections/` structure (line 123)
   - `pages`, `menuItems` - defined inline in `.eleventy.js`

3. **Shortcodes**: All defined inline in `.eleventy.js`
   - `version` (line 15)
   - `image` (line 20)
   - `icon` (line 50)

4. **Transforms**: Defined inline in `.eleventy.js`
   - `htmlmin` (line 166)

### Why searchFilter.js is No Longer Used

From issue #1 (search-feature-async):
- Eleventy v3 made `templateContent` async
- The original `searchFilter.js` accessed `templateContent` synchronously
- Solution: Migrated search logic to a collection (`searchIndex`) which can handle async operations
- The logic from `searchFilter.js` was ported to `/lib/collections/searchIndex.js`
- Original file was kept "for reference" but is not imported or used anywhere

## Revised Plan

Since the original idea in `ideas.md` assumed we needed to move filters to `/lib/filters/`, but the current codebase shows:
1. There are no active filters in the `/filters/` directory
2. All active filters are inline in `.eleventy.js`
3. The only file in `/filters/` is a legacy file that's not being used

**The simplified plan is to clean up the legacy code rather than reorganize active code.**

## Implementation Steps

### 1. Remove Legacy searchFilter.js
- Delete `/filters/searchFilter.js` (no longer needed, logic has been ported to searchIndex collection)
- Rationale: Keeping legacy code adds confusion and maintenance burden

### 2. Remove Empty /filters/ Directory
- After deleting the legacy file, remove the now-empty `/filters/` directory
- This achieves the original goal of a cleaner root directory

### 3. Verify No References Remain
- Confirm no imports or references to `./filters/searchFilter` exist in the codebase
- Already verified in exploration phase - the file is not imported anywhere

### 4. Update Documentation
- Update `ideas.md` to mark this task as completed
- Note the simplified approach vs. original expectation
- Document the current organization pattern for future reference

### 5. Testing
- Run `npm run build` to ensure build still succeeds
- Verify search functionality still works (it should - we're only removing unused code)

## Why Not Move Other Utilities?

The current architecture keeps most Eleventy configuration inline in `.eleventy.js`, which is:
- **Standard practice** for Eleventy projects
- **Easy to navigate** - everything is in one file
- **Not causing problems** - the file is well-organized at ~250 lines

The `/lib/collections/` structure makes sense for the searchIndex because:
- It's a complex collection with substantial logic (~60 lines)
- Collections can benefit from separation more than simple filters/shortcodes
- It was needed to solve the async compatibility issue

Moving simple 2-5 line filters to separate files would add unnecessary complexity.

## Expected Outcome

After this cleanup:
- Cleaner root directory (no `/filters/` folder)
- No confusing legacy code
- Maintains current working architecture
- Sets precedent: complex utilities go in `/lib/`, simple ones stay inline

## Risk Assessment

**Low risk:**
- Only removing unused code
- No active functionality depends on the files being removed
- Easy to revert if needed (file is in git history)
