---
layout: text
title: Paintings
permalink: /paintings/
---

<div class="image-container">
{% assign paintings = site.static_files | where: "path", "/paintings/" %}
{% assign sorted_paintings = paintings | sort: "name" | reverse %}

{% for painting in sorted_paintings %}
  {% assign name_parts = painting.name | split: " " %}
  {% assign year = name_parts[0] %}
  {% assign title = name_parts[1] %}
  {% assign extension = painting.extname %}

  <div class="image-container">
    <img src="{{ site.baseurl }}{{ painting.path }}" alt="{{ title }}">
    <div class="image-title">{{ title }}</div>
    <div class="image-year">{{ year }}</div>
  </div>
{% endfor %}
</div>