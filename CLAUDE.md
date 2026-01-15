# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm start          # Dev server with hot reload (localhost:8080) + PostCSS watcher + Writing Prompts tool (localhost:3001)
npm run build      # Production build to _site/
npm run cleanup    # Kill any orphaned dev server processes on ports 3001/8080
npm run debug      # Run Eleventy with debug logging
```

**Requires Node.js 22+**

## Architecture

This is an Eleventy v3 static site (Spacebook template) with Tailwind CSS and Alpine.js.

### Template Engine Flow
- Markdown files use Liquid templating (`markdownTemplateEngine: "liquid"`)
- Layout files (`.njk`) use Nunjucks (`htmlTemplateEngine: "njk"`)
- **Critical**: Layouts use `{{ content | safe }}` (not `layoutContent` - this changed in Eleventy v3)

### Layout Hierarchy
```
layouts/base.njk      → Core HTML shell, includes header/nav/footer components
  └── layouts/page.njk    → Standard page with prose styling
  └── layouts/content.njk → Content pages (fragments, builds)
```

### Collections (defined in .eleventy.js)
- `pages` - content/pages/*.md (main nav pages)
- `fragments` - content/fragments/**/*.md (blog posts/thoughts, sorted newest first)
- `builds` - content/builds/**/*.md (project posts, sorted newest first)
- `tagList` - unique tags with counts (excludes reserved: all, nav, post, posts, page, pages, tagList, menuItems, fragments, builds)
- `menuItems` - pages with eleventyNavigation data, sorted by order

### CSS Architecture
- `styles/tailwind.css` - main stylesheet with custom CSS variables
- Dev: PostCSS outputs to `_tmp/style.css`, watched by Eleventy
- Prod: PostCSS outputs to `_site/style.css`, minified with clean-css

### Color Theming
CSS custom properties in `styles/tailwind.css`:
- `--color-bg`, `--color-bg-secondary` - background colors
- `--color-text`, `--color-text-secondary` - text colors
- `--color-link`, `--color-link-hover` - link colors
- `--color-border` - border color
- Dark mode: applied via `.dark` class on html element

### Site Configuration
`_data/site.json` controls feature flags:
- `enableSearch`, `enableDarkMode`, `enableDatestamp`
- `navigationStyle: "vertical"` (sidebar) or `"horizontal"` (top nav)

### Markdown Plugins (configured in .eleventy.js)
Extensive markdown-it setup including: emoji, footnotes, task lists, anchors, attrs, containers (callout, callout-blue, callout-pink, callout-green, warning), and auto-external-link targeting.

### Callout Syntax
```markdown
::: callout
Default callout content
:::

::: warning
Warning content (red background)
:::
```
Color variants: `callout-blue`, `callout-pink`, `callout-green`

## Content Structure

```
content/
├── pages/          # Main site pages (home, builds, fragments, etc.)
├── fragments/      # Blog posts organized by subfolder (medical/, thoughts/)
├── builds/         # Project/build posts
└── images/         # Image assets (copied to _site)
```

### Page Frontmatter
```yaml
---
title: Page Title
date: Last Modified
permalink: /page-url/
eleventyNavigation:
  key: UniqueKey
  order: 1
  title: Display Title
tags:
  - tag1
  - tag2
---
```

## Writing Prompts Tool

Local-only Express server at `tools/writing-prompts/` for generating content from prompts. Creates files in `content/writing/[subfolder]/YYYY-MM-DD-prompt-slug.md`. Only runs in development, not deployed.
