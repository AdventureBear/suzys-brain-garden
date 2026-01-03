---
title: <fragments />
date: Last Modified
permalink: /fragments/
eleventyNavigation:
  key: fragments
  order: 1
  title: fragments
layout: layouts/page.njk
---
<pre style="background: transparent; border: none; padding: 0; margin: 0; font-family: 'Courier New', Courier, monospace; font-size: inherit; color: var(--color-text); white-space: pre-wrap;">
Each piece starts with a prompt and ends when the moment ends. 

Whatever's left is left on purpose. With each fragment, you're entering a room containing a moment or memory from my past. Mostly truthful, mostly written in silence. Sometimes read out loud. 

If you listen carefully, you may hear words lingering in the air.
</pre>
<hr />
<div class="space-y-1 mt-8">
{% for post in collections.fragments %}
<div><a href="{{ post.url }}">{{ post.data.title }}</a></div>
{% endfor %}
</div>
