---
title: Hello, world.
date: Last Modified
permalink: /
eleventyNavigation:
  key: Hello
  order: 0
  title: Home
---

fragments end where they end. builds end where they work.

<div class="space-y-1 mt-8">
<h3>fragments</h3>
{% for post in collections.fragments %}
<div><a href="{{ post.url }}">{{ post.data.title }}</a></div>
{% endfor %}
</div>


<div class="space-y-1">
<h3>builds</h3>
{% for post in collections.builds %}
<div><a href="{{ post.url }}">{{ post.data.title }}</a></div>
{% endfor %}
</div>

->*Onward...*<-



