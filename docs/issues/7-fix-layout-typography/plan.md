# Plan: Fix Layout & Typography Issues

## Problem Statement

Multiple layout and typography issues make the site less visually appealing and harder to read:

### Current Issues

1. **Date Misalignment**: Publication date appears in a separate row above content, breaking contextual association with the post title
2. **Hardcoded Date Labels**: Template uses hardcoded "Published" or "Updated" without differentiating between:
   - Pages (shouldn't show publication date)
   - Posts/Content (should show publication date)
   - Homepage (shouldn't show publication date)
3. **Footer Missing Information**:
   - No "Last Updated" timestamp for the site
   - No copyright notice
   - Not sticky at bottom of page
4. **Visual Borders**: Light gridlines/borders around divs create visual clutter
5. **Typography**:
   - Default "ui-sans-serif" is boring and doesn't scale well
   - No visual hierarchy through font choices
   - Poor readability at different font sizes

## User Requirements

### Layout & Dates
- Move "Updated at" to footer with site's last modification date
- Add copyright notice: "© 2025-{current year}"
- Show publication date **under** the post title (only for content, not pages)
- Make footer sticky at bottom of page
- Remove all gridlines/borders showing divs

### Typography
- **Headers/Titles**: Eczar (Google Font with Georgia fallback)
- **Body Text**: Georgia Pro or system Georgia
- Better visual hierarchy with font sizing

## Current State Analysis

### File: `_includes/layouts/page.njk`

**Lines 8-16 (Vertical Nav)** and **Lines 30-40 (Horizontal Nav)**:
- Date shows in separate `<div>` above content
- Hardcoded text: "Published" (line 10) or "Updated" (line 33)
- No logic to differentiate content types

###File: `_includes/components/footer.njk`
- Simple footer with optional contact/github links
- No copyright or last updated date
- Has border: `border-t border-gray-100 dark:border-gray-800` (line 1)
- Not sticky positioned

### File: `_includes/layouts/base.njk`
- Navigation has borders: `border-r border-b border-gray-100 dark:border-gray-800` (line 8)

### Fonts
- No custom font configuration in `tailwind.config.js`
- Using Tailwind defaults: `ui-sans-serif, system-ui, -apple-system...`
- No Google Fonts loaded in `_includes/components/head.njk`

## Solution Approach

### 1. Typography Implementation

#### Option A: Google Fonts (Recommended)
**Pros:**
- Eczar is a beautiful serif designed specifically for digital reading
- Consistent across all devices and browsers
- Good FOUT (Flash of Unstyled Text) handling with font-display: swap

**Cons:**
- External dependency (Google Fonts CDN)
- Slight performance impact (additional HTTP request)

**Implementation:**
1. Add Google Fonts link to `head.njk`:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Eczar:wght@400;600;700&display=swap" rel="stylesheet">
   ```

2. Update `tailwind.config.js`:
   ```javascript
   theme: {
     extend: {
       fontFamily: {
         'sans': ['Georgia', 'ui-serif', 'serif'], // Body text
         'serif': ['Eczar', 'Georgia', 'serif'],    // Headers
       }
     }
   }
   ```

#### Option B: System Fonts Only
Use Georgia (available on all systems) for both, with different weights:
- Headers: Georgia Bold
- Body: Georgia Regular

**Pros:**- No external dependencies
- Zero performance impact
- Georgia is a high-quality typeface

**Cons:**
- Less distinctive
- Less visual hierarchy

**Recommendation**: Use Option A for better visual appeal

**USER DECISION: Use Georgia only (Option B)**
- Native system font, zero HTTP requests
- Can add self-hosted Eczar later if desired

### 2. Date Display Logic - REVISED APPROACH

**Create separate `content.njk` layout** (cleaner, more explicit):

1. Duplicate `page.njk` → `_includes/layouts/content.njk`
2. In `content.njk`: Always show "Published {date}" under title (no conditionals)
   ```njk
   <article>
     <h2 class="dark:text-gray-500">{{ title }}</h2>
     <div class="text-sm text-gray-500 mb-4">
       Published <time datetime="{{ page.date | machineDate }}">{{ page.date | readableDate }}</time>
     </div>
     <!-- rest of content -->
   </article>
   ```

3. In `page.njk`: Remove ALL date display (pages don't show publication dates)
4. Update all content .json files to use `content.njk`:
   - `content/writing/writing.json`
   - `content/writing/coaching/coaching.json`
   - `content/writing/coding/coding.json`
   - `content/writing/medical/medical.json`
   - `content/writing/thoughts/thoughts.json`
   - `content/maker/maker.json`

5. Leave `page.njk` for `content/pages/pages.json`

### 3. Footer Enhancements

Update `footer.njk` to:
1. Remove border classes
2. Add sticky positioning
3. Add copyright with dynamic year
4. Add site last updated date

```njk
<footer class="sticky top-[100vh] mt-12 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
  <div class="flex flex-col items-center justify-center p-4 space-y-2">

    <!-- Social Links Row -->
    <div class="flex items-center space-x-4">
      {% if site.enableContact == 1 %}
      <a aria-label="Contact" href="/contact" rel="noopener noreferrer">
        <!-- Contact SVG -->
      </a>
      {% endif %}

      {% if site.enableGithubLink == 1 %}
      <a aria-label="GitHub" href="{{ site.githubUrl }}" target="_blank" rel="noopener noreferrer">
        <!-- GitHub SVG -->
      </a>
      {% endif %}

      {% if site.enableNetlifyCMS == 1 %}
      <a aria-label="Netlify CMS" href="/admin/" target="_blank" rel="noopener noreferrer">
        <!-- CMS SVG -->
      </a>
      {% endif %}
    </div>

    <!-- Footer Text Row -->
    <div class="text-center text-sm">
      {% if site.footer %}
      <div>{{ site.footer | safe }}</div>
      {% endif %}
      <div class="mt-1">Copyright © 2025-{{ "now" | date: "%Y" }} • Last updated: {{ collections.all | getNewestCollectionItemDate | readableDate }}</div>
    </div>

  </div>
</footer>
```

**Note**: Need to create `getNewestCollectionItemDate` filter in `.eleventy.js`

### 4. Remove Borders

Files to update:
- `footer.njk:1` - Remove `border-t border-gray-100 dark:border-gray-800`
- `base.njk:8` - Remove `border-r border-b border-gray-100 dark:border-gray-800`

### 5. Create Date Filter

Add to `.eleventy.js`:
```javascript
// Get the most recent modification date from all content
eleventyConfig.addFilter("getNewestCollectionItemDate", collection => {
  if (!collection || !collection.length) {
    return new Date();
  }

  return new Date(
    Math.max(...collection.map(item => {
      return item.date ? item.date.getTime() : 0;
    }))
  );
});
```

## Implementation Order

1. **Typography** (tailwind.config.js - use Georgia)
2. **Date Filter Update** (.eleventy.js - change "LLL" to "MMM" for short month)
3. **Create content.njk layout** (duplicate page.njk, add date display)
4. **Update page.njk** (remove all date display)
5. **Update .json files** (6 files to use content.njk)
6. **Footer** (footer.njk - add copyright, last updated, sticky, remove borders)
7. **Remove Borders** (base.njk navigation)

**User Preferences:**
- Font: Georgia (native, no HTTP request)
- Copyright: "Copyright © 2025-{year}"
- Date format: "MMM dd, yyyy" (e.g., "Dec 31, 2025")

## Testing Plan

1. **Typography**:
   - Verify Eczar loads for h1, h2, h3, h4, h5, h6
   - Verify Georgia for body text
   - Check font hierarchy at different screen sizes
   - Test dark mode

2. **Date Display**:
   - Homepage (/) - should NOT show publication date
   - Pages (/maker, /writing, /contact) - should NOT show publication date
   - Writing content (/content/writing/*) - SHOULD show publication date under title
   - Maker content (/content/maker/*) - SHOULD show publication date under title

3. **Footer**:
   - Verify sticky positioning (stays at bottom)
   - Check copyright shows current year range
   - Verify "Last updated" shows correct date
   - Test social links still work
   - Confirm no borders visible

4. **Borders**:
   - Verify no gridlines around navigation
   - Verify no gridlines around footer
   - Check dark mode

## Edge Cases

- What if no content exists? (getNewestCollectionItemDate should return current date)
- What if user has custom site.footer text? (Preserve it, add copyright below)
- What about mobile view? (Footer should stack vertically, still sticky)

## Alternative: Georgia Only

If user prefers not to use Google Fonts, use:
```javascript
fontFamily: {
  'sans': ['Georgia', 'serif'],
  'serif': ['Georgia', 'serif'],
}
```

With CSS:
```css
h1, h2, h3, h4, h5, h6 {
  font-weight: 700; /* Bold for headers */
}
body {
  font-weight: 400; /* Regular for body */
}
```
