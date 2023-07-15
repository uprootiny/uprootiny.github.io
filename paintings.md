---
layout: default
title: Paintings
permalink: /paintings/
---

<div class="image-container">
  {% for painting in site.static_files %}
    {% if painting.path contains "/paintings/" %}
      {% assign filename_parts = painting.basename | split: " " %}
      {% assign year = filename_parts[0] %}
      {% assign title = filename_parts | slice: 1 | join: " " %}
      
      <div class="image-item">
        <img src="{{ site.baseurl }}{{ painting.path }}" alt="{{ title }}">
        <p class="image-title">{{ title }}</p>
        <p class="image-year">{{ year }}</p>
      </div>
    {% endif %}
  {% endfor %}
</div>
