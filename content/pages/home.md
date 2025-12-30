---
title: Hello, world.
date: Last Modified
permalink: /
eleventyNavigation:
  key: Hello
  order: 0
  title: Home
---

<div class="space-y-1">
<h3>Writing</h3>
{% for post in collections.writing %}
<div><a href="{{ post.url }}">{{ post.data.title }}</a></div>
{% endfor %}
</div>


<div class="space-y-1">
<h3>Maker</h3>
{% for post in collections.maker %}
<div><a href="{{ post.url }}">{{ post.data.title }}</a></div>
{% endfor %}
</div>

->*Onward...*<-



