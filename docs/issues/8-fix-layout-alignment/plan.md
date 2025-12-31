# Plan: Fix Layout Alignment Issues

## Problem Statement

From screenshot analysis, four alignment issues identified:

### Issue #1: Footer Not Full Width
**Problem**: Footer is constrained to content area width, not extending across full page
**Current**: Footer inside `<main>` which has left padding for nav (md:pl-64 lg:pl-72)
**Visual**: Footer appears centered/narrow instead of edge-to-edge

### Issue #2: Navigation Left Padding Misalignment
**Problem**: Nav menu has p-4 padding, but header has px-4 md:px-8
**Current**: Nav (base.njk:8) has `p-4`, header has `px-4 md:px-8`
**Result**: Nav menu items don't align with header title/subtitle
**User wanted**: Consistent gutter across ALL content

### Issue #3: Orphaned Edit Link on Pages
**Problem**: Edit link still appears at top of page.njk (lines 6-14)
**Current**: Separate div with Edit link before content
**Should be**: Same placement as content.njk (with title/date)

### Issue #4: Vertical Alignment Mismatch
**Problem**: Nav starts at mt-20, content has mt-4
**Current**:
- Nav (base.njk:8): `mt-20`
- Content (page.njk:17): `mt-4`
**Result**: Nav menu sits higher than content title
**Root cause**: Unnecessary mt-4 on content wrapper

## Root Cause Analysis

### Footer Issue
Footer is inside `<main>` tag which has:
```html
<main class="...md:pl-64 lg:pl-72">
```
This left padding pushes footer content right.

**Solution**: Move footer outside of `<main>` OR make it full width with negative margins

### Nav Padding Issue
Inconsistent padding:
- Header: `px-4 md:px-8` (horizontal only)
- Nav: `p-4` (all sides)

**Solution**: Change nav to `px-4 md:px-8` to match header

### Edit Link Issue (page.njk)
Lines 6-14 have standalone Edit div that wasn't updated in PR #9.
Only content.njk was updated.

**Solution**: Move Edit link to same row as title (like content.njk)

### Vertical Alignment
Content wrapper has `mt-4` creating gap above title.
Nav has `mt-20` for header clearance.

**Solution**: Remove `mt-4` from content wrapper (line 17)

## Solution Approach

### 1. Footer - Full Width (Two Options)

**Option A**: Move footer outside `<main>`
```njk
<main>{{ content | safe }}</main>
{% include "components/footer.njk" %}
```

**Pros**: Clean separation, footer truly full width
**Cons**: Need to handle dark mode background

**Option B**: Keep in main, use full width
```njk
<footer class="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
```

**Pros**: Stays in main, handles dark mode
**Cons**: CSS trick, less semantic

**Recommendation**: Option A - cleaner structure

### 2. Nav Padding Alignment
```njk
<!-- base.njk line 8 -->
<nav class="...px-4 md:px-8">
```
Change `p-4` → `px-4 md:px-8` to match header

### 3. Edit Link - page.njk
Remove lines 6-14, add to title section like content.njk:
```njk
<h2>{{ title }}</h2>
<div class="flex items-center justify-between text-sm text-gray-500 mb-6">
  <span>&nbsp;</span> <!-- Empty span for spacing -->
  {% if site.enableEditButton == true %}
  <a class="..." href="...">Edit</a>
  {% endif %}
</div>
```

### 4. Vertical Alignment
```njk
<!-- page.njk line 17 - remove mt-4 -->
<div class="px-6 md:px-6 lg:px-8 xl:px-12 w-full max-w-5xl">
```

Also check content.njk has same fix.

## Implementation Plan

### Step 1: Fix Footer (base.njk)
Move footer outside `<main>` tag
Ensure it extends full width
Add proper dark mode classes

### Step 2: Fix Nav Padding (base.njk)
Change nav from `p-4` to `px-4 md:px-8`

### Step 3: Fix Edit Link (page.njk)
Remove orphaned Edit div (lines 6-14)
Add Edit link with title (like content.njk)
Handle case where there's no date (use empty span)

### Step 4: Fix Vertical Alignment (page.njk + content.njk)
Remove `mt-4` from content wrapper divs
Ensure nav and content align at top

## Files to Modify

1. `_includes/layouts/base.njk` - Footer placement, nav padding
2. `_includes/layouts/page.njk` - Edit link, vertical alignment
3. `_includes/layouts/content.njk` - Vertical alignment (if needed)
4. `_includes/components/footer.njk` - May need adjustment for full width

## Testing Checklist

- [ ] Footer extends full width of viewport
- [ ] Footer is single line (already done in PR #9)
- [ ] Nav menu left edge aligns with header title
- [ ] Content left edge has consistent padding
- [ ] Edit link appears with title on pages
- [ ] Edit link appears with date on content
- [ ] Nav menu and content titles vertically aligned
- [ ] No extra whitespace above content
- [ ] Dark mode works correctly
- [ ] Mobile view still works

## Edge Cases

1. **Horizontal nav mode**: Check if footer needs different handling
2. **No Edit button**: Ensure layout doesn't break
3. **With TOC**: Ensure alignment still works
4. **Mobile**: Footer should still be full width

## Visual Verification

Compare before/after:
- Footer width (should touch edges)
- Nav/header/content left alignment (should all line up)
- Edit link placement (should be with title)
- Vertical alignment (nav and content should start at same height)
