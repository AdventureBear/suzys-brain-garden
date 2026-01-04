---
title: <manifest />
date: Last Modified
permalink: /manifest/
eleventyNavigation:
  key: manifest
  order: 3
  title: manifest
layout: layouts/page.njk
---
<pre style="background: transparent; border: none; padding: 0; margin: 0; font-family: 'Courier New', Courier, monospace; font-size: inherit; color: var(--color-text); white-space: pre-wrap;">
A record of what's aboard.
Threads that surface more than once.
Follow one to see where it leads.
</pre>
<hr />
<div class="space-y-1 mt-8">
{% for item in collections.tagList %}
<div><a href="/manifest/{{ item.tag | slugify }}/">{{ item.tag }}</a> <span style="color: var(--color-text-secondary);">({{ item.count }})</span></div>
{% endfor %}
</div>
