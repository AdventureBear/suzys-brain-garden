---
title: Writing
date: Last Modified
permalink: /writing/
eleventyNavigation:
  key: Writing
  order: 1
  title: Writing
layout: layouts/page.njk
---

# My Writing

A collection of thoughts, stories, and insights on coaching, medicine, coding, and life.

{% for post in collections.writing %}
<article class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
  <h2 class="text-2xl font-bold mb-2">
    <a href="{{ post.url }}" class="hover:text-blue-600 dark:hover:text-blue-400">
      {{ post.data.title }}
    </a>
  </h2>

  <div class="text-sm text-gray-600 dark:text-gray-400 mb-3">
    <time datetime="{{ post.date | machineDate }}">
      {{ post.date | readableDate }}
    </time>
  </div>

  {% if post.data.tags %}
  <div class="flex flex-wrap gap-2 mb-3">
    {% for tag in post.data.tags %}
      {% if tag != "writing" %}
      <span class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
        {{ tag }}
      </span>
      {% endif %}
    {% endfor %}
  </div>
  {% endif %}

  {% if post.data.excerpt %}
  <p class="text-gray-700 dark:text-gray-300">{{ post.data.excerpt }}</p>
  {% endif %}
</article>
{% endfor %}

---

## Browse by Topic

<div class="mt-6 prose dark:prose-invert">
  <p class="text-sm text-gray-600 dark:text-gray-400">
    Click any tag above to see related posts, or explore these common themes:
  </p>

  <div class="flex flex-wrap gap-2 mt-4">
    <a href="/writing/" class="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800">
      All Posts
    </a>
  </div>
</div>
