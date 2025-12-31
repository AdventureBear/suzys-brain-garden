# Writing Prompts Tool

A local-only development tool for generating writing prompts and creating content for your brain garden.

## What This Is

A standalone Express app that runs alongside your Eleventy dev server to help you:
- Browse 115+ attention-first writing prompts
- Write responses in markdown
- Save them directly to your content folders
- Automatically generate proper frontmatter

## Features

- **115 Curated Prompts**: Attention-first, configuration-based prompts (no emotional framing)
- **Search Prompts**: Filter prompts by keyword
- **Cycle Through Prompts**: Previous/Next buttons or get random prompts
- **Smart Title Generation**: Auto-generates title from first 5 words of content (editable)
- **Markdown Editor**: Write with live preview, word/character count, and markdown help
- **Folder-Based Tags**: Auto-loads tags from folder configuration
- **Custom Tags**: Add your own tags beyond folder defaults
- **Folder Selection**: Choose subfolder in writing/ or create new ones
- **Auto-Save Drafts**: Saves to localStorage so you don't lose work
- **File Generation**: Creates .md files with clean URLs and proper frontmatter
- **Usage Tracking**: See which prompts you've used, favorite prompts
- **Dark Mode**: Respects your system's dark mode preference

## How to Use

### 1. Start the Tool

The tool runs automatically when you start your dev server:

```bash
npm start
```

This starts three servers:
- **http://localhost:8080** - Your brain garden site (Eleventy)
- **http://localhost:3001** - Writing prompts tool
- PostCSS watcher for styles

### 2. Access the Tool

Visit **http://localhost:3001** in your browser

### 3. Write

1. Browse prompts using Search, Previous/Next, or Random buttons
2. Write your response in the markdown editor
   - Title auto-generates from first 5 words (edit if desired)
   - Use Edit/Split/Preview modes to see markdown rendering
3. Select a subfolder (tags auto-populate from folder)
   - Add custom tags if desired (comma-separated)
4. Click "Save"

### 4. Your File is Created

The tool creates a file at:
```
content/writing/[subfolder]/your-title-slug.md
```

With frontmatter like:
```markdown
---
title: "Your Custom Title"
date: 2025-12-30
permalink: /your-title-slug/
tags: ["folder-tag", "custom-tag-1", "custom-tag-2"]
---

[Your content here]

---

**Prompt**: The full prompt text
**Date**: December 30, 2025
```

**Note**:
- Filename uses title (first 5 words), no date prefix
- Permalink is clean: `/your-title-slug/`
- Tags combine folder defaults + your custom tags
- Layout comes from folder's .json file

### 5. Commit When Ready

The file appears immediately in your repo. Commit and push when you're ready to publish.

## Deployment

**This tool NEVER deploys to Netlify.**

- Only runs locally during `npm start`
- Netlify runs `npm run build` (no server involved)
- The tool's code sits in your repo but is never executed in production

## File Structure

```
tools/writing-prompts/
├── server.js              # Express server
├── prompts.json           # 115 prompts
├── public/
│   ├── index.html         # UI
│   ├── app.js            # Alpine.js logic
│   └── style.css         # Styling
└── README.md             # This file
```

## Customization

### Adding Prompts

Edit `prompts.json` - just add strings to the array.

### Changing the Port

Edit `server.js` and change:
```javascript
const PORT = 3001;
```

### Configuring Folder Tags

Each subfolder can have a `[subfolder].json` file with default tags:

```json
{
  "tags": ["personal-essay", "reflection", "observation"],
  "layout": "layouts/page.njk"
}
```

When you select that folder, its tags auto-populate. You can then add custom tags on top.

### Modifying Frontmatter

Edit the `generateFrontmatter()` function in `server.js`.

## Troubleshooting

**Tool won't start?**
- Make sure Express is installed: `npm install`
- Check port 3001 isn't already in use

**Files not saving?**
- Check console for errors
- Ensure content/writing/ directory exists

**Lost your draft?**
- Check browser's localStorage
- Drafts expire after 7 days

## Prompts Philosophy

These prompts are "attention-first" - they ask you to describe configurations (of people, space, timing, systems) rather than emotions or beliefs. Meaning emerges from arrangement, not commentary.

Good prompts for this system:
- Don't mention emotion or belief
- Don't frame things as broken
- Ask "what was arranged?" not "what do you think?"

Examples:
- "A silence that everyone seemed to agree not to fill"
- "A process that works better than people expect"
- "A place where people wait without sitting"

## Credits

Prompts curated from conversation about attention-based writing practices.
Built for Suzy's Brain Garden.
