# Todo List: Fix Layout & Typography

## Pre-Implementation
- [x] Create branch `7-fix-layout-typography`
- [x] Create issue folder structure
- [x] Analyze current layout and typography
- [x] Write plan.md
- [x] Write todo.md
- [ ] Present findings and get user approval

## Implementation

### Typography
- [ ] Update tailwind.config.js with Georgia font family
- [ ] Test Georgia rendering for headers and body

### Date Handling
- [ ] Update `readableDate` filter in .eleventy.js (LLL → MMM for short month)
- [ ] Create `getNewestCollectionItemDate` filter in .eleventy.js
- [ ] Create new `content.njk` layout (duplicate of page.njk)
- [ ] Add publication date display in content.njk (below title)
- [ ] Remove ALL date display from page.njk
- [ ] Update content/writing/writing.json to use content.njk
- [ ] Update content/writing/coaching/coaching.json to use content.njk
- [ ] Update content/writing/coding/coding.json to use content.njk
- [ ] Update content/writing/medical/medical.json to use content.njk
- [ ] Update content/writing/thoughts/thoughts.json to use content.njk
- [ ] Update content/maker/maker.json to use content.njk

### Footer
- [ ] Remove border classes from footer.njk
- [ ] Add sticky positioning (sticky top-[100vh])
- [ ] Add copyright: "Copyright © 2025-{current year}"
- [ ] Add "Last updated" with site modification date (short format)
- [ ] Restructure footer layout (centered, stacked)

### Remove Borders
- [ ] Remove borders from footer.njk
- [ ] Remove borders from base.njk navigation

## Testing

### Typography Testing
- [ ] Verify Georgia renders for all headers (h1-h6)
- [ ] Verify Georgia for body text
- [ ] Check font weight hierarchy (bold headers vs regular body)
- [ ] Check font rendering at mobile size
- [ ] Check font rendering at tablet size
- [ ] Check font rendering at desktop size
- [ ] Test dark mode typography

### Date Display Testing
- [ ] Test homepage (/) - should NOT show date (uses page.njk)
- [ ] Test /maker page - should NOT show date (uses page.njk)
- [ ] Test /writing page - should NOT show date (uses page.njk)
- [ ] Test /contact page - should NOT show date (uses page.njk)
- [ ] Test writing content - SHOULD show "Published MMM dd, yyyy" under title (uses content.njk)
- [ ] Test maker content - SHOULD show "Published MMM dd, yyyy" under title (uses content.njk)
- [ ] Verify date format is "Dec 31, 2025" style (short month)

### Footer Testing
- [ ] Verify footer is sticky at bottom
- [ ] Check copyright year range is correct
- [ ] Verify "Last updated" shows recent date
- [ ] Test footer in light mode
- [ ] Test footer in dark mode
- [ ] Verify social links work
- [ ] Test mobile footer layout
- [ ] Confirm no borders visible

### Border Removal Testing
- [ ] Check navigation has no gridlines (light mode)
- [ ] Check navigation has no gridlines (dark mode)
- [ ] Check footer has no gridlines (light mode)
- [ ] Check footer has no gridlines (dark mode)

## Documentation
- [ ] Update implementation-summary.md with changes made
- [ ] Document font choices and reasoning

## Git & PR
- [ ] Stage all changes
- [ ] Commit with descriptive message
- [ ] Push branch to remote
- [ ] Create pull request with summary

## Notes
- **Font Decision**: Georgia only (native, no HTTP requests)
  - Can add self-hosted Eczar later if desired
- **Copyright Format**: "Copyright © 2025-{year}"
- **Date Format**: "MMM dd, yyyy" (e.g., "Dec 31, 2025")
- **Layout Approach**: Separate content.njk for content vs page.njk for pages
- Footer layout: centered, stacked on mobile
- Date shows only for writing/* and maker/* content (via content.njk)
