# Ideas & Enhancement Opportunities

This file tracks ideas for enhancing Suzy's Brain Garden functionality and features.

**Last Updated**: 2025-12-29

---

## Outstanding TODOs from Recent Work

### High Priority

#### 1. Reorganize Project Structure - Move Filters to /lib
**Status**: ✅ COMPLETED (2025-12-29)
**What was done**:
- Removed legacy `/filters/searchFilter.js` (no longer used after Eleventy v3 upgrade)
- Removed empty `/filters/` directory
- Cleaned up root directory structure

**Outcome**:
- Cleaner root directory achieved
- Removed confusing legacy code
- Current organization pattern documented:
  - Complex collections → `/lib/collections/` (e.g., searchIndex)
  - Simple filters/shortcodes/transforms → inline in `.eleventy.js`

**See**: PR #[TBD], docs/issues/2-reorganize-filters/

---

### Medium Priority

#### 2. Optimize Tailwind Configuration
**Current state**: Working but with warnings
**Potential improvements**:
- Fine-tune content paths to eliminate warnings
- Consider removing `important: true` and using specific overrides instead
- Review and optimize purge/content scanning for better performance

#### 3. Comprehensive Feature Testing
**Manual testing needed for**:
- Dark mode toggle functionality
- Navigation system
- Markdown features (footnotes, task lists, containers, etc.)
- Image optimization (@11ty/eleventy-img v4)
- All pages render correctly
- Netlify build and deployment

---

### Low Priority

#### 4. Tailwind v4 Upgrade Investigation
**Status**: Currently on v3.4.0
**Why not now**: v4 has breaking changes that require CSS rewrites

**Future exploration**:
- Research v4 architecture and benefits
- Plan CSS rewrite strategy (v4 `@apply` works differently)
- Test in separate branch
- Document migration path

#### 5. Documentation Enhancements
**Opportunities**:
- Add inline comments for new async patterns in `.eleventy.js`
- Document Eleventy v3 migration gotchas
- Create troubleshooting guide for common issues
- Update README with current tech stack versions

---

## Enhancement Ideas

### Content & Knowledge Management

#### 6. Enhanced Cross-Linking
**Idea**: Improve the brain garden's networked thought capabilities
- Automatic backlink generation (similar to Obsidian/Roam)
- Visual graph view of content relationships
- Related content suggestions based on tags/topics
- Broken link detection and reporting

#### 7. Content Tagging & Taxonomy
**Idea**: Better organize and discover content
- Hierarchical tag system
- Tag cloud visualization
- Filter content by multiple tags
- Tag-based navigation

#### 8. Progressive Enhancement for Interactivity
**Idea**: Leverage Alpine.js v3 for richer interactions
- Collapsible sections for long articles
- Inline code execution/demos
- Interactive diagrams or visualizations
- Filtering and sorting without page reload

### Developer Experience

#### 9. Improved Build Performance
**Ideas to explore**:
- Implement incremental builds in Eleventy
- Optimize image processing pipeline
- Cache markdown processing results
- Profile and optimize slow filters/shortcodes

#### 10. Better Development Tooling
**Potential additions**:
- Live preview of markdown changes
- Automated link checking
- Content linting (markdown style, frontmatter validation)
- Pre-commit hooks for consistency

### Content Features

#### 11. Enhanced Markdown Capabilities
**Possible additions**:
- Math equation support (KaTeX or MathJax)
- Mermaid diagrams support
- Code syntax highlighting themes
- Embed support (YouTube, CodePen, etc.)
- Table of contents generation

#### 12. Content Metadata & Analytics
**Ideas**:
- Reading time estimates
- Last modified dates (from git)
- Content freshness indicators
- Simple analytics integration (privacy-focused)
- Popular/trending content section

### Design & UX

#### 13. Accessibility Audit & Improvements
**Focus areas**:
- Keyboard navigation testing
- Screen reader compatibility
- Color contrast verification
- ARIA labels and landmarks
- Skip links and focus management

#### 14. Mobile Experience Optimization
**Considerations**:
- Touch-friendly navigation
- Optimized typography for small screens
- Progressive Web App (PWA) capabilities
- Offline support with service workers

### Content Creation Workflow

#### 15. Content Templates
**Idea**: Streamline creating new content
- Template for different content types (note, article, reference)
- Starter frontmatter with common fields
- Command-line scaffolding tool
- Quick-create workflow

#### 16. Draft & Publishing Workflow
**Features to consider**:
- Draft posts (excluded from build)
- Scheduled publishing based on frontmatter dates
- Content preview before publishing
- Changelog or "what's new" page

---

## Ideas from Implementation Summary

Based on the Node 22 / Eleventy v3 upgrade, here are insights for future work:

### Lessons Learned to Apply

1. **Keep dependencies updated regularly** - Avoiding major version jumps prevents painful migrations
2. **Monitor framework roadmaps** - Knowing about breaking changes early helps planning
3. **Maintain upgrade documentation** - Future-you will thank present-you
4. **Test edge cases** - Template rendering, async operations, plugin compatibility

### Technical Debt to Address

1. Review all deprecated dependency warnings
2. Consider modern alternatives to legacy packages
3. Update Node.js version in documentation
4. Ensure all scripts work cross-platform (Windows/Mac/Linux)

---

## How to Use This File

- Add new ideas as they come up
- Mark items as completed when implemented
- Move completed items to implementation summaries
- Reference specific issue numbers when available
- Keep ideas actionable and specific

---

## Contributing Ideas

If you have ideas for enhancing the brain garden:
1. Add them to this file with clear description
2. Note why it would be valuable
3. Consider implementation complexity
4. Link to relevant resources or examples
