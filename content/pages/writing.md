---
title: <fragments />
date: Last Modified
permalink: /writing/
eleventyNavigation:
  key: fragments
  order: 1
  title: fragments
layout: layouts/page.njk
---

Each piece starts with a prompt and ends when the moment ends. Whatever's left is left on purpose.

With each fragment, you're entering a room containing a moment or memory from my past. Mostly truthful, mostly written in silence. Sometimes read out loud. If you listen carefully, you may still hear my last words drifting in the air.

<div class="space-y-1 mt-8">
{% for post in collections.writing %}
<div><a href="{{ post.url }}">{{ post.data.title }}</a></div>
{% endfor %}
</div>
