const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve prompts
app.get('/api/prompts', (req, res) => {
  const prompts = require('./prompts.json');
  res.json(prompts);
});

// Get existing folders in content/fragments/
app.get('/api/folders', (req, res) => {
  const fragmentsPath = path.join(__dirname, '../../content/fragments');

  try {
    const items = fs.readdirSync(fragmentsPath, { withFileTypes: true });
    const folders = items
      .filter(item => item.isDirectory())
      .map(item => item.name);

    res.json(folders);
  } catch (error) {
    console.error('Error reading folders:', error);
    res.json([]); // Return empty array if directory doesn't exist yet
  }
});

// Get tags for a specific folder
app.get('/api/folder-tags', (req, res) => {
  const { subfolder } = req.query;

  if (!subfolder) {
    return res.json({ tags: [] });
  }

  const jsonPath = path.join(__dirname, `../../content/fragments/${subfolder}/${subfolder}.json`);

  try {
    if (fs.existsSync(jsonPath)) {
      const data = fs.readFileSync(jsonPath, 'utf8');
      const config = JSON.parse(data);

      // Tags might be a string or an array
      let tags = [];
      if (config.tags) {
        if (Array.isArray(config.tags)) {
          tags = config.tags;
        } else if (typeof config.tags === 'string') {
          tags = [config.tags];
        }
      }

      res.json({ tags });
    } else {
      // No .json file found, return empty tags
      res.json({ tags: [] });
    }
  } catch (error) {
    console.error('Error reading folder tags:', error);
    res.json({ tags: [] });
  }
});

// Save prompt response
app.post('/api/save', (req, res) => {
  const { content, folder, subfolder, prompt, createNewSubfolder, newSubfolderName, title, tags } = req.body;

  try {
    // Determine the target folder
    let targetFolder = 'fragments';
    let targetSubfolder = subfolder;

    // Handle new subfolder creation
    if (createNewSubfolder && newSubfolderName) {
      targetSubfolder = newSubfolderName.toLowerCase().replace(/\s+/g, '-');
    }

    // Build the full path
    let fullPath = path.join(__dirname, '../../content', targetFolder);
    if (targetSubfolder) {
      fullPath = path.join(fullPath, targetSubfolder);
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    // Generate filename using title (no date prefix)
    const date = new Date();
    const slug = generateSlugFromTitle(title);
    const filename = `${slug}.md`;
    const filePath = path.join(fullPath, filename);

    // Generate frontmatter with title, tags, permalink, and prompt
    const frontmatter = generateFrontmatter(title, date, slug, tags, prompt);

    // Combine frontmatter and content (no prompt/date at end)
    const fileContent = `${frontmatter}\n${content}\n`;

    // Write file
    fs.writeFileSync(filePath, fileContent, 'utf8');

    res.json({
      success: true,
      filename,
      path: filePath.replace(path.join(__dirname, '../..'), '')
    });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Helper function to generate slug from title (limit to 5 words)
function generateSlugFromTitle(title) {
  // Get first 5 words
  const words = title.trim().split(/\s+/).slice(0, 5);
  const limitedTitle = words.join(' ');

  return limitedTitle
    .toLowerCase()
    .replace(/[↔]/g, '') // Remove special characters like arrows
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .substring(0, 50); // Limit total length as safety
}

// Helper function to generate frontmatter
function generateFrontmatter(title, date, slug, tags = [], prompt = '') {
  const dateStr = date.toISOString().split('T')[0];

  // Use provided tags or default to empty array
  const tagsArray = tags.length > 0 ? tags : ['writing'];

  // Permalink is just /slug/ (no subfolders)
  const permalink = `/${slug}/`;

  return `---
title: "${title}"
date: ${dateStr}
permalink: ${permalink}
tags: [${tagsArray.map(t => `"${t}"`).join(', ')}]
prompt: "${prompt}"
---`;
}

app.listen(PORT, () => {
  console.log(`\n🎨 Writing Prompt Tool running at http://localhost:${PORT}`);
  console.log(`📝 Visit this URL to start writing\n`);
});
