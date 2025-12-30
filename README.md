# Suzy's Brain Garden

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_BADGE_ID/deploy-status)](https://app.netlify.com/sites/suzys-brain-garden/deploys)

My personal digital garden and notebook built with [Eleventy](https://www.11ty.dev/) and [Tailwind CSS](https://tailwindcss.com/).

**Live Site:** https://suzys-brain-garden.netlify.app

---

## About

This is my personal digital space for collecting thoughts, ideas, and knowledge. Built using the [Spacebook](https://spacebook.app) template by [@broeker](https://github.com/broeker/spacebook).

**Note:** This is a personal site with my own content. If you're looking for the Spacebook template to build your own site, visit [spacebook.app](https://spacebook.app) or the [Spacebook GitHub repo](https://github.com/broeker/spacebook).

## Tech Stack

- **Static Site Generator:** [Eleventy](https://www.11ty.dev/) v3.1.2
- **CSS Framework:** [Tailwind CSS](https://tailwindcss.com/) v3.4
- **JavaScript Framework:** [Alpine.js](https://alpinejs.dev/) v3
- **Markdown Parser:** [markdown-it](https://github.com/markdown-it/markdown-it) with multiple plugins
- **Hosting:** [Netlify](https://www.netlify.com/)

## Requirements

**You must be running Node.js version 22 or higher.**

- [Node.js](https://nodejs.org/) v22+
- [NVM](https://github.com/nvm-sh/nvm) (recommended for managing Node versions)

**Check your current Node version:**

```bash
node --version
```

## Local Development

### 1. Install dependencies

From the project root:

```bash
npm install
```

### 2. Start the development server

```bash
npm start
# or
npm run dev
```

This will start a local server at http://localhost:8080/ with hot reload enabled.

### 3. Build for production

```bash
npm run build
```

This generates optimized files in the `_site` directory.

## Project Structure

```
suzys-brain-garden/
├── _data/              # Global data files
│   └── site.json      # Site configuration
├── _includes/          # Layout templates and components
│   ├── layouts/       # Page layouts (Nunjucks)
│   └── components/    # Reusable components
├── content/            # Your content
│   ├── pages/         # Markdown pages
│   └── images/        # Image assets
├── styles/             # Tailwind CSS
├── _site/              # Generated site (do not edit)
└── .eleventy.js       # Eleventy configuration
```

## Writing Content

### Creating a New Page

1. Create a new `.md` file in `content/pages/`
2. Add frontmatter with title and navigation info:

```markdown
---
title: My Page Title
date: Last Modified
permalink: /my-page/
eleventyNavigation:
  key: MyPage
  order: 1
  title: My Page Title
---

Your content here...
```

### Adding Images

Place images in `content/images/` and reference them in markdown:

```markdown
![Alt text](/content/images/your-image.jpg)
```

## Configuration

### Site Settings

Edit `_data/site.json` to customize:

- Site name and description
- Navigation style (horizontal/vertical)
- Enable/disable features (dark mode, search, comments, etc.)
- GitHub repository URL
- Social links

### Styling

Tailwind CSS configuration is in `tailwind.config.js` at the project root.

Custom styles are in `styles/tailwind.css`.

## Netlify Deployment

### Build Settings

The site is configured to deploy automatically to Netlify when pushing to the `main` branch.

**Netlify Build Configuration** (from `netlify.toml`):

- **Build Command:** `npm run build`
- **Publish Directory:** `_site`
- **Node Version:** 22

### Environment Variables

No environment variables are required for basic deployment.

### Manual Deploy

To manually deploy to Netlify:

1. Push your changes to the `main` branch
2. Netlify will automatically build and deploy

Or use the Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## Recent Upgrades (December 2025)

This site was recently upgraded from Node 14 to Node 22 and Eleventy v0.11 to v3.1.2. Major changes include:

- **Eleventy:** 0.11.1 → 3.1.2
- **Tailwind CSS:** 2.0.2 → 3.4.0
- **Alpine.js:** 2.7.3 → 3.14.0
- **Node.js:** 14 → 22

### Critical Breaking Changes Fixed

**Eleventy v3 Layout Variable Change:**
- Changed `{{ layoutContent | safe }}` → `{{ content | safe }}` in all layout files
- This was preventing all page content from rendering

**Deprecated Package Replacements:**
- `html-minifier` → `html-minifier-terser`
- `uglify-es` → `terser`

For detailed upgrade notes, see `docs/issues/node22-local-dev/IMPLEMENTATION-SUMMARY.md`.

## Known Issues

- **Search functionality** is currently disabled while being updated for Eleventy v3 async compatibility

## Credits

Built with [Spacebook](https://spacebook.app) by [@broeker](https://github.com/broeker/spacebook).

## License

This site's content is my own. The Spacebook template is open source.

---

Made with ❤️ by Suzy
