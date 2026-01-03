---
title: <builds />
date: Last Modified
permalink: /builds/
eleventyNavigation:
  key: builds
  order: 2
  title: builds
layout: layouts/page.njk
---
<pre style="background: transparent; border: none; padding: 0; margin: 0; font-family: 'Courier New', Courier, monospace; font-size: inherit; color: var(--color-text); white-space: pre-wrap;">
A place for work that has somewhere to stand.  For things are built to last long enough to be used.
</pre>
<hr />

<div class="space-y-1 mt-8">
{% for post in collections.builds %}
<div><a href="{{ post.url }}">{{ post.data.title }}</a></div>
{% endfor %}
</div>
