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
<div class="flex flex-wrap gap-4 mt-8">
{% assign shuffled = collections.tagList | sample: collections.tagList.size %}
{% for item in shuffled %}
<a href="/manifest/{{ item.tag | slugify }}/" style="color: var(--color-text);">{{ item.tag }}</a>
{% endfor %}
</div>
