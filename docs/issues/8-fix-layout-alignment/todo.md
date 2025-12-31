# Todo: Fix Layout Alignment Issues

## Pre-Implementation
- [x] Analyze screenshot and identify issues
- [x] Create branch `8-fix-layout-alignment`
- [x] Create issue folder
- [x] Write plan.md
- [x] Write todo.md
- [ ] Present findings to user
- [ ] Get approval

## Implementation

### Issue #1: Footer Full Width
- [ ] Move footer outside `<main>` tag in base.njk
- [ ] Ensure footer has proper dark mode classes
- [ ] Verify footer extends edge-to-edge

### Issue #2: Nav Padding Alignment
- [ ] Change nav padding from `p-4` to `px-4 md:px-8` in base.njk
- [ ] Verify nav aligns with header title

### Issue #3: Edit Link on Pages
- [ ] Remove orphaned Edit div from page.njk (lines 6-14)
- [ ] Add Edit link to title section (like content.njk)
- [ ] Handle no-date case with empty span
- [ ] Test with and without Edit button enabled

### Issue #4: Vertical Alignment
- [ ] Remove `mt-4` from page.njk content wrapper (line 17)
- [ ] Check content.njk for same issue
- [ ] Verify nav and content titles align vertically

## Testing

### Visual Tests
- [ ] Footer extends full viewport width
- [ ] Footer is single line on desktop
- [ ] Nav left edge aligns with header title
- [ ] Content has consistent left gutter
- [ ] Edit link appears inline with title on pages
- [ ] Nav menu and page title vertically aligned
- [ ] No extra whitespace at top of content

### Functional Tests
- [ ] Build succeeds
- [ ] Dark mode works correctly
- [ ] Light mode works correctly
- [ ] Mobile view works
- [ ] Horizontal nav mode (if applicable)
- [ ] With TOC sidebar
- [ ] Without Edit button

### Cross-Browser
- [ ] Chrome/Safari (macOS)
- [ ] Firefox
- [ ] Mobile Safari

## Documentation
- [ ] Update implementation-summary.md
- [ ] Document changes made
- [ ] Note any trade-offs

## Git & PR
- [ ] Stage all changes
- [ ] Commit with descriptive message
- [ ] Push to remote
- [ ] Create pull request

## Notes
- Footer moved outside main for true full width
- Nav padding matches header for alignment
- Edit link placement consistent between page.njk and content.njk
- Vertical alignment fixed by removing unnecessary margin
