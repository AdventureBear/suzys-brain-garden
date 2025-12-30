# Implementation Plan: Writing Prompt System

**Issue**: Idea #41 - Built-in Writing Prompt System
**Branch**: `4-writing-prompt-system`
**Created**: 2025-12-30

## Overview

Implement a writing prompt system to encourage regular content creation in the brain garden. The system will display writing prompts and provide an interface for composing responses that become content in the garden.

## User Requirements

From the original request:
> "A built-in prompting system for the user (me) to open a writing window and respond to a prompt. These could be pregenerated prompts pulled from a data json, and/or an AI integrated prompting idea. I currently have a general description of the types of prompts I like."

### Clarified Requirements (2025-12-30):
- Write page should NOT be in main navigation (hidden link)
- NO categories needed - just browseable list of prompts
- 50-100+ prompts to start (created 115 prompts from SAMPLE-PROMPTS.md)
- Prompts should be "attention-first" (configurations, not emotions)
- Interface needs:
  - Button to cycle through prompts (not just random)
  - Editing window for markdown
  - Save functionality
  - **Folder selection** (choose writing, maker, etc.)
  - Auto-generate frontmatter based on folder
  - Auto-add tags based on folder selection

## Implementation Approach

We'll implement a **Phase 1 MVP** that provides immediate value while maintaining the static site architecture:

### Phase 1: MVP Features

1. **Prompt Library** (`_data/prompts.json`)
   - Store curated prompts organized by category
   - Categories: reflective, technical, creative, health, maker
   - User preferences for enabled categories

2. **Write Page** (`content/pages/write.md`)
   - Display a random prompt from enabled categories
   - "New Prompt" button to get different prompt
   - Writing interface with textarea
   - Live character/word count
   - Generate markdown template for easy file creation

3. **UI Components**
   - Alpine.js-powered writing interface (no page reload needed)
   - Responsive design (desktop-first, mobile-friendly)
   - Dark mode support (automatic via existing theme)
   - Markdown preview capability

4. **File Generation Helper**
   - Pre-formatted markdown template with frontmatter
   - Copy-to-clipboard functionality
   - Instructions for manual file creation
   - Suggested file naming: `content/writing/prompts/YYYY-MM-DD-slug.md`

## Technical Architecture

### Data Structure

```
_data/
  prompts.json          # Prompt library with categories
```

### Content

```
content/
  pages/
    write.md            # Main writing prompt page
  writing/
    prompts/            # New folder for prompt responses
```

### Components (if needed)

```
_includes/
  components/
    writing-prompt.njk  # Prompt display component (optional)
```

## Key Design Decisions

1. **Static-First Approach**: No backend required, works with Eleventy's static site generation
2. **Manual File Creation**: User copies generated markdown and creates file manually (simplest for MVP)
3. **LocalStorage for Preferences**: Remember which categories are enabled
4. **Alpine.js for Interactivity**: Leverage existing framework, no additional dependencies
5. **Progressive Enhancement**: Works without JavaScript, enhanced with it

## What We're NOT Building (Yet)

- Automatic file creation (requires Netlify functions or similar)
- AI-generated prompts (Phase 4 enhancement)
- Writing streak tracking (Phase 2)
- Database of responses (static site, manual tracking for now)
- Authentication/accounts (not needed for personal site)

## File Changes Required

### New Files
1. `_data/prompts.json` - Prompt library
2. `content/pages/write.md` - Writing prompt page
3. `content/writing/prompts/.gitkeep` - Ensure directory exists

### Modified Files
1. `_data/site.json` - Add navigation entry for Write page (optional)
2. Potentially create a dedicated layout if needed

## Success Criteria

- [ ] Prompts display correctly from JSON data
- [ ] Random prompt selection works
- [ ] Category filtering works
- [ ] Writing interface is usable and responsive
- [ ] Generated markdown template is valid
- [ ] Copy-to-clipboard works
- [ ] Dark mode works properly
- [ ] Mobile experience is acceptable
- [ ] No JavaScript errors
- [ ] Build succeeds without errors

## Testing Plan

1. **Functional Testing**
   - Load write page
   - Get random prompt
   - Switch categories
   - Write content
   - Copy markdown template
   - Create file manually and verify it builds

2. **UI Testing**
   - Test in light/dark mode
   - Test on mobile viewport
   - Test keyboard navigation
   - Verify accessibility (screen reader friendly)

3. **Build Testing**
   - Run `npm run build`
   - Verify no errors
   - Check generated HTML

## Future Enhancements

See IDEAS.md for full details on Phases 2-4:
- Phase 2: Enhanced UX with modal, live preview, auto-save
- Phase 3: Automation with git commit scripts
- Phase 4: AI-enhanced personalized prompts

## Questions to Address

1. Should the Write page be in main navigation or discoverable organically?
2. What's the initial set of prompts? (Need to curate 30-50 prompts)
3. Should we include example prompt responses?
4. Any specific prompt categories to prioritize?

## Risk Assessment

**Low Risk**:
- Pure additive feature (no existing code modification)
- Uses existing tech stack
- No external dependencies
- Can be disabled by not linking to it

**Potential Issues**:
- User friction with manual file creation (acceptable for MVP)
- Need good prompt curation (time investment upfront)
- LocalStorage limitations across devices (acceptable for now)

## Timeline Estimate

- Setup & Data Structure: 30 mins
- Write Page Implementation: 1-2 hours
- UI Polish & Testing: 1 hour
- Documentation: 30 mins

**Total**: 3-4 hours for complete MVP

## Implementation Order

1. Create `_data/prompts.json` with initial prompt set
2. Create basic write.md page with prompt display
3. Add Alpine.js interactivity (random prompt, categories)
4. Build writing interface with textarea
5. Add markdown template generation
6. Add copy-to-clipboard functionality
7. Test and polish UI
8. Update documentation
