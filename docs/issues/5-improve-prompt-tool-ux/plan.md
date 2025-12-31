# Implementation Plan: Improve Writing Prompt Tool UX

**Issue**: #5 - Improve Writing Prompt Tool UX
**Branch**: `5-improve-prompt-tool-ux`
**Created**: 2025-12-30

## Overview

Enhance the writing prompt tool to provide better control over titles, permalinks, slugs, and tags based on user feedback from first use.

## User Requirements

### Summary of Requested Changes

1. **Custom Title Field** - Add title input field (not using prompt as title)
2. **Smart Slug Generation** - Auto-generate from first 5 words of content or custom title
3. **Simpler Permalinks** - Remove date from filename, use just title slug
4. **Folder-Based Tags** - Auto-load tags from folder's .json file
5. **Custom Tags** - Allow adding additional tags beyond folder defaults
6. **Keep Prompt Footer** - Prompt and date stay at bottom of file (current behavior)

### Detailed Requirements

#### 1. Title Management
**Current**: Uses prompt text as title (creates very long titles)
**Desired**:
- Add "Title" input field in the form
- If empty, auto-generate from first 5 words of content
- Title should be editable before saving
- Prompt text stays at bottom of saved file

#### 2. Filename & Slug
**Current**: `YYYY-MM-DD-long-prompt-slug.md`
**Desired**:
- Filename: `title-slug.md` (no date prefix)
- Slug generated from title (first 5 words max)
- Shorter, cleaner permalinks
- Example: `something-i-noticed.md` instead of `2025-12-30-something-i-noticed-but-didnt-comment-on.md`

#### 3. Permalink Structure
**Current**: `/writing/thoughts/2025-12-30-something-i-noticed-but-didnt-comment-on/`
**Desired**: `/writing/thoughts/something-i-noticed/`

#### 4. Tags Management
**Current**: Tags = `["prompt-response", "subfolder-name"]`
**Desired**:
- Read tags from `content/writing/[subfolder]/[subfolder].json` if exists
- Auto-populate tag field when folder selected
- Allow user to add custom tags
- Combine folder tags + custom tags

## Technical Implementation Plan

### Files to Modify

1. **`tools/writing-prompts/public/index.html`**
   - Add "Title" input field
   - Add "Tags" input field (with auto-population from folder)
   - Reorder form fields for better UX

2. **`tools/writing-prompts/public/app.js`**
   - Add title state variable
   - Add tags state variable
   - Implement auto-title generation from content
   - Load folder tags when folder selected
   - Update slug generation (no date prefix)
   - Limit slug to first 5 words

3. **`tools/writing-prompts/server.js`**
   - Update filename generation (remove date prefix)
   - Update frontmatter generation (use custom title)
   - Support custom tags array
   - Read folder .json files for default tags

### New Functionality

#### Auto-Title Generation
```javascript
function generateTitleFromContent(content) {
    const firstLine = content.trim().split('\n')[0];
    const words = firstLine.split(/\s+/).filter(w => w.length > 0);
    return words.slice(0, 5).join(' ');
}
```

#### Folder Tags Loading
```javascript
async function loadFolderTags(subfolder) {
    const response = await fetch(`/api/folder-tags?subfolder=${subfolder}`);
    return await response.json();
}
```

#### New Server Endpoint
```javascript
app.get('/api/folder-tags', (req, res) => {
    const subfolder = req.query.subfolder;
    const jsonPath = `content/writing/${subfolder}/${subfolder}.json`;
    // Read and return tags from json file
});
```

### Updated Frontmatter Structure

**Before**:
```yaml
---
title: "Something I noticed but didn't comment on"
date: 2025-12-30
prompt: "Something I noticed but didn't comment on"
tags: ["prompt-response", "thoughts"]
layout: layouts/page.njk
---
```

**After**:
```yaml
---
title: "The Parking Lot Encounter"
date: 2025-12-30
permalink: /writing/thoughts/parking-lot-encounter/
tags: ["personal-essay", "observation", "custom-tag"]
layout: layouts/page.njk
---

[Content here]

---

**Prompt**: Something I noticed but didn't comment on
**Date**: December 30, 2025
```

### UI Changes

**Form Field Order** (top to bottom):
1. Prompt display (current)
2. **NEW: Title** (auto-generated, editable)
3. Writing area
4. **NEW: Tags** (auto-populated from folder, editable)
5. Folder selection
6. Save buttons

## Implementation Steps

### Phase 1: Title Field
1. Add title input to HTML
2. Add title state to Alpine component
3. Implement auto-generation from content (first 5 words)
4. Update on content change
5. Allow manual override

### Phase 2: Slug & Filename
1. Update slug generation to use title (not prompt)
2. Remove date prefix from filename
3. Limit to 5 words
4. Add permalink to frontmatter

### Phase 3: Tags System
1. Add tags input to HTML
2. Create `/api/folder-tags` endpoint
3. Read folder .json files for tags
4. Auto-populate tags field when folder selected
5. Allow comma-separated custom tags
6. Merge folder tags + custom tags

### Phase 4: Server Updates
1. Update `generateFrontmatter()` to use custom title
2. Update `generateSlug()` to use title, limit to 5 words
3. Update `generateFilename()` to remove date prefix
4. Add permalink generation
5. Support tags array

## Data Structure Changes

### Folder JSON Files
Each folder can have a `.json` file with default tags:

`content/writing/thoughts/thoughts.json`:
```json
{
  "tags": ["personal-essay", "reflection", "observation"],
  "defaultLayout": "layouts/page.njk"
}
```

`content/writing/medical/medical.json`:
```json
{
  "tags": ["health", "medical", "journal"],
  "defaultLayout": "layouts/page.njk"
}
```

## Success Criteria

- [ ] Title field added and functional
- [ ] Auto-title generation works (first 5 words of content)
- [ ] Filenames no longer include date prefix
- [ ] Slugs limited to first 5 words of title
- [ ] Permalinks use clean slug format
- [ ] Tags auto-populate from folder .json
- [ ] Custom tags can be added
- [ ] Prompt stays at bottom of saved file
- [ ] All existing functionality still works

## Testing Plan

1. **Title Generation**
   - Write content, verify auto-title appears
   - Edit title, verify custom title used
   - Save with auto-title
   - Save with custom title

2. **Filename & Slug**
   - Verify filename has no date prefix
   - Verify slug is limited to 5 words
   - Check permalink in frontmatter

3. **Tags**
   - Select folder, verify tags auto-populate
   - Add custom tags
   - Verify both sets appear in frontmatter
   - Test with folder that has no .json file

4. **Backwards Compatibility**
   - All existing features still work
   - Search, preview, favorites unchanged

## Risk Assessment

**Low Risk**:
- Additive changes (new fields)
- Existing functionality preserved
- No database migrations needed

**Potential Issues**:
- Slug conflicts if two posts have same first 5 words
  - Solution: Add date or number suffix if conflict detected
- Folder .json files might not exist
  - Solution: Graceful fallback to default tags

## Questions to Address

1. Should we check for filename conflicts and add a suffix?
2. What if first 5 words of content is less than 5 words?
3. Should we create folder .json files for existing folders?
4. What's the default tag set if no folder .json exists?

## Future Enhancements

- Suggest title using AI
- Check for duplicate slugs
- Bulk create folder .json files
- Title templates by folder type
