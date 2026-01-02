---
title: builds
date: Last Modified
permalink: /builds/
eleventyNavigation:
  key: builds
  order: 2
  title: builds
layout: layouts/page.njk
---

A place for work that has somewhere to stand.

Things built to last long enough to be used.

<div class="space-y-1 mt-8">
{% for post in collections.builds %}
<div><a href="{{ post.url }}">{{ post.data.title }}</a></div>
{% endfor %}
</div>
