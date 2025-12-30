const elasticlunr = require("elasticlunr");
const emojiRegex = require('emoji-regex/RGI_Emoji.js');

/**
 * Creates a search index for all markdown content using elasticlunr
 * Compatible with Eleventy v3
 *
 * Uses page.template.inputContent (raw markdown) which is async in v3
 */
module.exports = async function (collection) {
  // Create elasticlunr index with title and content fields
  var index = elasticlunr(function () {
    this.addField("title");
    this.addField("content");
    this.setRef("id");
  });

  // Get all markdown files
  const pages = collection.getFilteredByGlob("**/*.md");

  // In Eleventy v3, inputContent is async - wait for all content to load
  const pagesWithContent = await Promise.all(
    pages.map(async (page) => {
      try {
        // Await the async inputContent
        const content = await page.template?.inputContent;
        return {
          url: page.url,
          title: page.data.title,
          content: content || ''
        };
      } catch (error) {
        // Skip pages that fail
        console.warn(`Warning: Could not get content for ${page.url}:`, error.message);
        return null;
      }
    })
  );

  // Add each page to the search index
  pagesWithContent.forEach((page) => {
    // Skip null entries (pages that failed to render or have no content)
    if (!page || !page.content) {
      return;
    }

    index.addDoc({
      id: page.url,
      title: page.title,
      content: squash(page.content),
    });
  });

  /**
   * Processes content text for search indexing
   * - Converts to lowercase
   * - Removes HTML tags
   * - Removes duplicate words
   * - Removes common/short words
   * - Removes emojis
   * - Cleans up punctuation and spacing
   */
  function squash(text) {
    const regex = emojiRegex();
    var content = new String(text);

    // all lower case, please
    var content = content.toLowerCase();

    // remove all html elements and new lines
    var re = /(.*?&lt;.*?&gt;)/gi;
    var plain = unescape(content.replace(re, ''));

    // remove duplicated words
    var words = plain.split(' ');
    var deduped = [...(new Set(words))];
    var dedupedStr = deduped.join(' ')

    // remove short and less meaningful words
    var result = dedupedStr.replace(/\b(\.|\,|\<;|the|a|an|and|am|you|I|to|if|of|off|me|my|on|in|it|is|at|as|we|do|be|has|but|was|so|no|not|or|up|for)\b/gi, '');
    //remove newlines, and punctuation
    result = result.replace(/\.|\,|\?|<p>|-|—|\n/g, '');
    //remove repeated spaces
    result = result.replace(/[ ]{2,}/g, ' ');
    // remove most emoji
    result = result.replace(/([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?/g, '');

    let match;
    while (match = regex.exec(result)) {
      const emoji = match[0];
      result = result.replace(emoji,' ')
    }

    return result;
  }

  // Return the index as JSON for use in the template
  return index.toJSON();
};
