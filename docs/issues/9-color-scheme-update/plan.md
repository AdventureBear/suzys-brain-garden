# Issue #9: Update Color Scheme to Match Tania Rascia's Website

## Overview

Update the site's light and dark color schemes to match the elegant, readable design of [taniarascia.com](https://www.taniarascia.com/).

## Reference Design Analysis

### Light Mode Colors (Tania Rascia)
- **Background**: Warm beige `#fdf9ee`
- **Text**: Dark gray `#323239`
- **Links**: Pink `#d33682`
- **Cards/Secondary BG**: Slightly darker beige `#f6f0df`
- **Borders**: Muted beige `#e5dcbd`

### Dark Mode Colors (Tania Rascia)
- **Background**: Dark gray `#1c1c20`
- **Text**: Light gray `#c8c8cf`
- **Links**: Light pink `#ff8ac1`
- **Cards/Secondary BG**: Slightly lighter gray `#25252b`
- **Borders**: Medium gray `#323239`

### Typography
- **Body**: System font stack (San Francisco, Segoe UI, etc.)
- **Headings**: Same system fonts with DM Sans preference
- **Code**: Menlo, monospace
- **Base size**: 16px

### Layout Notes
- Max content width: ~700px
- Clean borders and consistent spacing
- 6px border radius standard

## Implementation Plan

### Phase 1: Define CSS Custom Properties
1. Create CSS variables for the color scheme in `styles/tailwind.css`
2. Define both light and dark mode color tokens

### Phase 2: Update Background Colors
1. Light mode: Change white backgrounds to warm beige
2. Dark mode: Change slate-950 to Tania's dark gray (#1c1c20)
3. Update header, footer, nav, and main content areas

### Phase 3: Update Text Colors
1. Light mode: Use Tania's dark gray for body text
2. Dark mode: Use Tania's light gray for body text
3. Update headings, secondary text, and metadata

### Phase 4: Update Link Colors
1. Change link color to pink in both modes
2. Add hover underline effect (2px thick)
3. Ensure visited state works well

### Phase 5: Update Component Colors
1. Update borders to match scheme
2. Update input/search field colors
3. Update any card or secondary background areas
4. Update blockquote and callout styles

### Phase 6: Testing & Polish
1. Test all pages in both light and dark modes
2. Verify contrast ratios meet WCAG AA
3. Test navigation active states
4. Fine-tune any remaining issues

## Files to Modify

- `styles/tailwind.css` - Add CSS variables, update prose styles
- `_includes/layouts/base.njk` - Update background classes
- `_includes/components/header.njk` - Update header colors
- `_includes/components/footer.njk` - Update footer colors
- `_includes/components/nav.njk` - Update navigation colors
- `_includes/layouts/page.njk` - Update content area colors
- `_includes/layouts/content.njk` - Update content area colors

## Success Criteria

- [ ] Light mode matches Tania's warm beige aesthetic
- [ ] Dark mode uses Tania's darker, more neutral gray
- [ ] Links are pink with hover underline effect
- [ ] Text is readable with good contrast in both modes
- [ ] All existing functionality preserved
