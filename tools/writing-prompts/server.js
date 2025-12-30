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

// Get existing folders in content/writing/
app.get('/api/folders', (req, res) => {
  const writingPath = path.join(__dirname, '../../content/writing');

  try {
    const items = fs.readdirSync(writingPath, { withFileTypes: true });
    const folders = items
      .filter(item => item.isDirectory())
      .map(item => item.name);

    res.json(folders);
  } catch (error) {
    console.error('Error reading folders:', error);
    res.json([]); // Return empty array if directory doesn't exist yet
  }
});

// Save prompt response
app.post('/api/save', (req, res) => {
  const { content, folder, subfolder, prompt, createNewSubfolder, newSubfolderName } = req.body;

  try {
    // Determine the target folder
    let targetFolder = 'writing';
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

    // Generate filename
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const slug = generateSlug(prompt);
    const filename = `${dateStr}-${slug}.md`;
    const filePath = path.join(fullPath, filename);

    // Generate frontmatter
    const frontmatter = generateFrontmatter(prompt, date, targetSubfolder);

    // Combine frontmatter and content
    const fileContent = `${frontmatter}\n${content}\n\n---\n\n**Prompt**: ${prompt}\n**Date**: ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}\n`;

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

// Helper function to generate slug from prompt
function generateSlug(prompt) {
  return prompt
    .toLowerCase()
    .replace(/[↔]/g, '') // Remove special characters like arrows
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .substring(0, 50); // Limit length
}

// Helper function to generate frontmatter
function generateFrontmatter(prompt, date, subfolder) {
  const dateStr = date.toISOString().split('T')[0];
  const title = prompt.length > 60 ? prompt.substring(0, 60) + '...' : prompt;

  // Generate tags based on subfolder
  let tags = ['prompt-response'];
  if (subfolder) {
    tags.push(subfolder);
  }

  return `---
title: "${title}"
date: ${dateStr}
prompt: "${prompt}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
layout: layouts/page.njk
---`;
}

app.listen(PORT, () => {
  console.log(`\n🎨 Writing Prompt Tool running at http://localhost:${PORT}`);
  console.log(`📝 Visit this URL to start writing\n`);
});
