---
layout: text
title: Paintings
permalink: /paintings/
---

{% assign paintings_by_year = site.static_files | where: "path", "/paintings/" | group_by_exp: "painting", "painting.basename | split: ' ' | first" %}
<div class="image-container">
  {% assign sorted_paintings = site.static_files | where: "path", "/paintings/" | sort: "modified_time" | reverse %}
  {% for painting in sorted_paintings %}
    {% assign filename_parts = painting.name | split: " " %}
    {% assign year = filename_parts[0] %}
    {% assign title_parts = filename_parts | slice: 1, filename_parts.size | join: " " %}
    {% assign title = title_parts | remove: ".jpg" %}

    <div class="painting-item">
      <img src="{{ site.baseurl }}/paintings/{{ painting.name }}" alt="{{ title }}">
      <p class="image-title">{{ title }}</p>
      <p class="image-year">{{ year }}</p>
    </div>
  {% endfor %}
</div>