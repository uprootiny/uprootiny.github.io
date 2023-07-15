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
    {% assign title_with_extension = title_parts | join: " " %}
    {% assign title = title_with_extension | split: "." | slice: 0, -1 | join: "." %}

    <div class="image-item">
      <img src="{{ site.baseurl }}{{ painting.path | relative_url }}" alt="{{ title }}">
      <div class="image-title">{{ title }} <div class="image-year">{{ year }}</div></div>
      <br/>
      
    </div>
  {% endfor %}
</div>

