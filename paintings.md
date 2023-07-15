---
layout: paintings
title: Paintings
permalink: /paintings/
---

<div class="image-container">
  {% assign paintings = site.static_files | where_exp: "file", "file.path contains '/paintings/'" %}
  {% assign sorted_paintings = paintings | sort: "path" | reverse %}

  {% for painting in sorted_paintings %}
    {% assign name_parts = painting.name | split: " " %}
    {% assign year = name_parts[0] %}
    {% assign title_parts = name_parts | drop_first: 1 %}
    {% assign title = title_parts | join: " " | split: "." | first %}

    <div class="image-item">
      <img src="{{ site.baseurl }}{{ painting.path | relative_url }}" alt="{{ title }}">
      <div class="image-title">{{ painting.name }}</div>
      <div class="image-year">{{ year }}</div>
    </div>
  {% endfor %}
</div>

