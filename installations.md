---
layout: text
title: installations
permalink: /installations/
---

<div class="image-container">
  {% for image in site.static_files %}
    {% if image.path contains "/installation2025/" %}
      {% assign filename = image.path | split: "/" | last %}
      {% assign basename = filename | remove: ".jpg" | remove: ".jpeg" %}
      {% assign potential_year = basename | slice: 0, 4 %}
      {% if potential_year == potential_year | plus: 0 %}
        {% assign year = potential_year %}
        {% assign title = basename | remove_first: potential_year | strip %}
      {% else %}
        {% assign year = "Unknown" %}
        {% assign title = basename %}
      {% endif %}
      <div class="image-item">
        <img src="{{ site.baseurl }}{{ image.path }}" alt="{{ title }}">
        <div class="caption">{{ title }} – {{ year }}</div>
      </div>
    {% endif %}
  {% endfor %}
</div>
