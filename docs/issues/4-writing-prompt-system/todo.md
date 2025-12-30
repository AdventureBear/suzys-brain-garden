# Todo List: Writing Prompt System Implementation

**Issue**: #4 - Writing Prompt System
**Status**: Planning
**Last Updated**: 2025-12-30

## Planning Phase ✅

- [x] Create feature branch `4-writing-prompt-system`
- [x] Create issue folder in `docs/issues/`
- [x] Create plan.md
- [x] Create todo.md
- [x] Create implementation-summary.md template
- [ ] Get approval to proceed

## Implementation Phase

### 1. Data Structure & Prompts
- [ ] Create `_data/prompts.json`
- [ ] Write 10+ reflective prompts
- [ ] Write 10+ technical prompts
- [ ] Write 10+ creative prompts
- [ ] Write 5+ health/medical prompts
- [ ] Write 5+ maker/project prompts
- [ ] Set up prompt categories structure
- [ ] Add user preferences section

### 2. Content Structure
- [ ] Create `content/writing/prompts/` directory
- [ ] Add `.gitkeep` to prompts directory
- [ ] Create example prompt response (optional)

### 3. Write Page - Basic Structure
- [ ] Create `content/pages/write.md`
- [ ] Add frontmatter (title, navigation, layout)
- [ ] Create basic page structure
- [ ] Add intro text explaining the feature

### 4. Write Page - Prompt Display
- [ ] Add Nunjucks logic to read prompts data
- [ ] Implement category filtering
- [ ] Create prompt display section
- [ ] Add prompt metadata (category, etc.)

### 5. Write Page - Interactivity (Alpine.js)
- [ ] Add Alpine.js component initialization
- [ ] Implement random prompt selection
- [ ] Add "New Prompt" button functionality
- [ ] Add category toggle checkboxes
- [ ] Store preferences in localStorage
- [ ] Load preferences on page load

### 6. Writing Interface
- [ ] Create textarea for writing
- [ ] Add character count display
- [ ] Add word count display
- [ ] Style textarea appropriately
- [ ] Make textarea responsive
- [ ] Ensure dark mode compatibility

### 7. Markdown Template Generation
- [ ] Create template string with frontmatter
- [ ] Populate template with current prompt
- [ ] Add date to template
- [ ] Add category/tags to template
- [ ] Display generated markdown
- [ ] Style markdown display area

### 8. Copy to Clipboard Feature
- [ ] Add "Copy Markdown" button
- [ ] Implement clipboard API functionality
- [ ] Add success feedback (tooltip/alert)
- [ ] Add fallback for unsupported browsers
- [ ] Test clipboard functionality

### 9. UI/UX Polish
- [ ] Add helpful instructions
- [ ] Create visual hierarchy
- [ ] Add icons (if appropriate)
- [ ] Ensure consistent spacing
- [ ] Mobile responsive testing
- [ ] Tablet responsive testing
- [ ] Desktop layout optimization

### 10. Accessibility
- [ ] Add proper ARIA labels
- [ ] Test keyboard navigation
- [ ] Ensure focus indicators visible
- [ ] Check heading hierarchy
- [ ] Test with screen reader (basic)

### 11. Optional: Navigation Integration
- [ ] Decide if Write should be in main nav
- [ ] Update site.json if needed
- [ ] Add eleventyNavigation to write.md if needed

### 12. Testing
- [ ] Test prompt randomization
- [ ] Test category filtering
- [ ] Test localStorage persistence
- [ ] Test markdown generation
- [ ] Test clipboard copy
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Test on mobile device
- [ ] Test keyboard-only navigation
- [ ] Run `npm run build` - verify success
- [ ] Check for console errors
- [ ] Verify generated HTML is valid

### 13. Documentation
- [ ] Add instructions to write.md page
- [ ] Update README.md (if needed)
- [ ] Document prompt file format
- [ ] Add comments to complex code

### 14. Final Review
- [ ] Code review (self)
- [ ] Check all files are staged
- [ ] Update implementation-summary.md
- [ ] Verify all success criteria met

### 15. Deployment
- [ ] Stage all changes
- [ ] Write commit message
- [ ] Commit changes
- [ ] Push branch to remote
- [ ] Create pull request
- [ ] Add PR description
- [ ] Test on Netlify deploy preview (if available)

## Notes

- Keep it simple for MVP
- Focus on core functionality
- Can enhance later based on usage
- Manual file creation is acceptable for now

## Blockers

None identified yet.

## Questions

- [ ] Confirm desired prompt categories
- [ ] Confirm initial prompt count (30-50?)
- [ ] Confirm navigation placement preference
