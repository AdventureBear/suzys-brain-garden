---
title: Maker
date: Last Modified
permalink: /maker/
eleventyNavigation:
  key: Maker
  order: 2
  title: Maker
layout: layouts/page.njk
---

<div class="space-y-1">
{% for post in collections.maker %}
<div><a href="{{ post.url }}">{{ post.data.title }}</a></div>
{% endfor %}
</div>
